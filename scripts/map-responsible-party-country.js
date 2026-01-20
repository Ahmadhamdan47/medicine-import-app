// scripts/map-responsible-party-country.js
/**
 * One-time script to map drugs with empty/null/N/A responsible party country
 * to the correct country based on existing responsible party data in the database
 * 
 * Usage: node scripts/map-responsible-party-country.js
 */

const sequelize = require('../config/databasePharmacy');
const { QueryTypes } = require('sequelize');

/**
 * Build the responsible party to country mapping from existing drug data
 */
async function buildResponsiblePartyMapping() {
    try {
        console.log('Building responsible party country mapping from database...');
        
        const query = `
            SELECT DISTINCT 
                TRIM(ResponsibleParty) as ResponsibleParty,
                ResponsiblePartyCountry
            FROM drug
            WHERE ResponsibleParty IS NOT NULL 
            AND ResponsibleParty != ''
            AND ResponsiblePartyCountry IS NOT NULL 
            AND ResponsiblePartyCountry != ''
            AND ResponsiblePartyCountry != 'N/A'
            AND ResponsiblePartyCountry != 'Unknown'
            ORDER BY ResponsibleParty, ResponsiblePartyCountry
        `;
        
        const results = await sequelize.query(query, {
            type: QueryTypes.SELECT
        });
        
        console.log(`✓ Found ${results.length} responsible party-country mappings in database`);
        return results;
    } catch (error) {
        console.error('Error building mapping:', error.message);
        throw error;
    }
}

/**
 * Create a lookup map from the mapping data
 * Maps responsible party name to primary country
 * Handles case-insensitive matching and trimmed names
 */
function createLookupMap(mappingData) {
    const lookupMap = {};
    const stats = {};
    
    mappingData.forEach(item => {
        const party = item.ResponsibleParty.trim();
        const country = item.ResponsiblePartyCountry;
        const normalizedKey = party.toLowerCase();
        
        // Track how many times each party-country combo appears
        if (!stats[normalizedKey]) {
            stats[normalizedKey] = {};
        }
        if (!stats[normalizedKey][country]) {
            stats[normalizedKey][country] = 0;
        }
        stats[normalizedKey][country]++;
    });
    
    // Choose the most common country for each party
    Object.keys(stats).forEach(normalizedKey => {
        const countries = stats[normalizedKey];
        const mostCommonCountry = Object.keys(countries).reduce((a, b) => 
            countries[a] > countries[b] ? a : b
        );
        lookupMap[normalizedKey] = mostCommonCountry;
    });
    
    console.log(`✓ Created lookup map with ${Object.keys(lookupMap).length} unique responsible parties`);
    
    // Show some examples
    const examples = Object.keys(lookupMap).slice(0, 5);
    if (examples.length > 0) {
        console.log('\nSample mappings:');
        examples.forEach(key => {
            console.log(`  • "${key}" → ${lookupMap[key]}`);
        });
        console.log('');
    }
    
    return lookupMap;
}

/**
 * Get country from lookup map with fuzzy matching
 */
function getCountryFromLookup(responsibleParty, lookupMap) {
    if (!responsibleParty) return null;
    
    // Try exact match first
    if (lookupMap[responsibleParty]) {
        return lookupMap[responsibleParty];
    }
    
    // Try trimmed and lowercase match
    const normalized = responsibleParty.trim().toLowerCase();
    if (lookupMap[normalized]) {
        return lookupMap[normalized];
    }
    
    return null;
}

/**
 * Find drugs that need mapping (null, empty, or 'N/A' ResponsiblePartyCountry)
 */
async function findDrugsNeedingMapping() {
    try {
        console.log('\nFinding drugs with empty/null/N/A responsible party country...');
        
        const query = `
            SELECT DrugID, DrugName, ResponsibleParty, ResponsiblePartyCountry
            FROM drug
            WHERE ResponsibleParty IS NOT NULL 
            AND ResponsibleParty != ''
            AND (
                ResponsiblePartyCountry IS NULL 
                OR ResponsiblePartyCountry = '' 
                OR ResponsiblePartyCountry = 'N/A' 
                OR ResponsiblePartyCountry = 'Unknown'
            )
        `;
        
        const drugs = await sequelize.query(query, {
            type: QueryTypes.SELECT
        });
        
        console.log(`✓ Found ${drugs.length} drugs needing mapping`);
        return drugs;
    } catch (error) {
        console.error('Error finding drugs:', error.message);
        throw error;
    }
}

/**
 * Update drugs with the correct responsible party country
 */
async function updateDrugsWithMapping(drugs, lookupMap) {
    let successCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const updates = [];
    
    console.log('\nProcessing drug updates...');
    
    for (const drug of drugs) {
        const responsibleParty = drug.ResponsibleParty;
        const correctCountry = getCountryFromLookup(responsibleParty, lookupMap);
        
        if (correctCountry && correctCountry !== 'Unknown') {
            updates.push({
                drugId: drug.DrugID,
                drugName: drug.DrugName,
                responsibleParty: responsibleParty,
                oldCountry: drug.ResponsiblePartyCountry || 'null',
                newCountry: correctCountry
            });
        } else {
            skippedCount++;
            console.log(`  ⚠ Skipping DrugID ${drug.DrugID}: No mapping found for "${responsibleParty}"`);
        }
    }
    
    if (updates.length === 0) {
        console.log('\n✓ No drugs to update');
        return { successCount, skippedCount, errorCount };
    }
    
    console.log(`\nPreparing to update ${updates.length} drugs...`);
    console.log('\nSample updates (first 5):');
    updates.slice(0, 5).forEach(update => {
        console.log(`  • DrugID ${update.drugId}: ${update.oldCountry} → ${update.newCountry} (${update.responsibleParty})`);
    });
    
    // Perform bulk update
    try {
        // Update in batches for better performance
        const batchSize = 100;
        for (let i = 0; i < updates.length; i += batchSize) {
            const batch = updates.slice(i, i + batchSize);
            
            // Update each drug in the batch
            for (const update of batch) {
                try {
                    await sequelize.query(
                        'UPDATE drug SET ResponsiblePartyCountry = :country WHERE DrugID = :drugId',
                        {
                            replacements: { 
                                country: update.newCountry,
                                drugId: update.drugId
                            },
                            type: QueryTypes.UPDATE
                        }
                    );
                    successCount++;
                } catch (error) {
                    errorCount++;
                    console.error(`  ✗ Error updating DrugID ${update.drugId}: ${error.message}`);
                }
            }
            
            console.log(`  Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(updates.length / batchSize)} (${successCount} successful)`);
        }
        
        console.log(`\n✓ Update complete!`);
    } catch (error) {
        console.error('Error during bulk update:', error.message);
        throw error;
    }
    
    return { successCount, skippedCount, errorCount };
}

/**
 * Generate a summary report
 */
function generateReport(results, totalDrugs, duration) {
    console.log('\n' + '='.repeat(60));
    console.log('MAPPING SUMMARY REPORT');
    console.log('='.repeat(60));
    console.log(`Total drugs needing mapping: ${totalDrugs}`);
    console.log(`Successfully updated:         ${results.successCount}`);
    console.log(`Skipped (no mapping):        ${results.skippedCount}`);
    console.log(`Errors:                      ${results.errorCount}`);
    console.log(`Duration:                    ${duration.toFixed(2)}s`);
    console.log('='.repeat(60));
    
    if (results.successCount > 0) {
        console.log('\n✓ Responsible party country mapping completed successfully!');
    }
    if (results.skippedCount > 0) {
        console.log(`\n⚠ ${results.skippedCount} drugs were skipped (no mapping found)`);
    }
    if (results.errorCount > 0) {
        console.log(`\n✗ ${results.errorCount} drugs failed to update`);
    }
}

/**
 * Main execution function
 */
async function main() {
    const startTime = Date.now();
    
    console.log('='.repeat(60));
    console.log('RESPONSIBLE PARTY COUNTRY MAPPING SCRIPT');
    console.log('='.repeat(60));
    console.log(`Started at: ${new Date().toLocaleString()}\n`);
    
    try {
        // Test database connection first
        console.log('Testing database connection...');
        try {
            await sequelize.authenticate();
            console.log('✓ Database connection successful\n');
        } catch (dbError) {
            console.error('✗ Database connection failed!');
            console.error('Error:', dbError.message);
            console.error('\nPlease ensure:');
            console.error('  1. MySQL server is running');
            console.error('  2. Database credentials are correct');
            console.error('  3. Database "ommal_medapiv2" exists');
            console.error('  4. User has proper permissions\n');
            process.exit(1);
        }
        
        // Step 1: Build the mapping from existing database data
        const mappingData = await buildResponsiblePartyMapping();
        
        if (mappingData.length === 0) {
            console.log('\n✗ No mapping data found in database. Cannot proceed.');
            process.exit(1);
        }
        
        // Step 2: Create lookup map
        const lookupMap = createLookupMap(mappingData);
        
        // Step 3: Find drugs needing mapping
        const drugsNeedingMapping = await findDrugsNeedingMapping();
        
        if (drugsNeedingMapping.length === 0) {
            console.log('\n✓ No drugs need mapping. All done!');
            process.exit(0);
        }
        
        // Step 4: Confirm before proceeding
        console.log('\n' + '-'.repeat(60));
        console.log('Ready to update drugs. This operation will modify the database.');
        console.log('-'.repeat(60));
        
        // In production, you might want to add a confirmation prompt here
        // For now, proceeding automatically
        
        // Step 5: Update drugs with correct mapping
        const results = await updateDrugsWithMapping(drugsNeedingMapping, lookupMap);
        
        // Step 6: Generate report
        const duration = (Date.now() - startTime) / 1000;
        generateReport(results, drugsNeedingMapping.length, duration);
        
        console.log('\n✓ Script completed successfully!');
        process.exit(0);
        
    } catch (error) {
        console.error('\n✗ Script failed with error:', error);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main().catch(error => {
        console.error('Unhandled error:', error);
        process.exit(1);
    });
}

module.exports = { main };
