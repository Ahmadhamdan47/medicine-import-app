// General script to insert NSSF pricing data for any drug
// Usage: node insertNSSFData.js <drugId> <effectiveDate> <publicPrice> <nssfPrice> <coveragePercentage> <coverageAmount> [realCoveragePercentage]
const sequelize = require('../config/databasePharmacy');

async function insertNSSFData(
    drugId,
    effectiveDate,
    publicPriceLbp,
    nssfPriceLbp,
    nssfCoveragePercentage,
    nssfCoverageAmountLbp,
    realNssfCoveragePercentage = null
) {
    console.log('🚀 Inserting NSSF pricing data...\n');

    try {
        // Test database connection first
        console.log('📡 Testing database connection...');
        await sequelize.authenticate();
        console.log('✅ Database connection successful!\n');

        // Calculate real coverage percentage if not provided
        if (realNssfCoveragePercentage === null && publicPriceLbp > 0) {
            realNssfCoveragePercentage = (nssfCoverageAmountLbp / publicPriceLbp) * 100;
            console.log(`💡 Calculated real NSSF coverage percentage: ${realNssfCoveragePercentage.toFixed(2)}%`);
        }

        console.log('📝 Inserting NSSF pricing data for:');
        console.log(`   Drug ID: ${drugId}`);
        console.log(`   Effective Date: ${effectiveDate}`);
        console.log(`   Public Price (MoPH): LBP ${parseFloat(publicPriceLbp).toLocaleString()}`);
        console.log(`   NSSF Price: LBP ${parseFloat(nssfPriceLbp).toLocaleString()}`);
        console.log(`   NSSF Coverage Percentage: ${nssfCoveragePercentage}%`);
        console.log(`   NSSF Coverage Amount: LBP ${parseFloat(nssfCoverageAmountLbp).toLocaleString()}`);
        console.log(`   Real NSSF Coverage Percentage: ${realNssfCoveragePercentage}%\n`);

        // Check if the drug exists
        const [drugCheck] = await sequelize.query(
            'SELECT DrugID, DrugName FROM drug WHERE DrugID = ?',
            { replacements: [drugId] }
        );

        if (drugCheck.length === 0) {
            console.log(`⚠️  Warning: Drug ID ${drugId} not found in the drug table.`);
            console.log('   The NSSF pricing data will still be inserted, but make sure the drug exists.');
        } else {
            console.log(`✅ Drug found: ${drugCheck[0].DrugName} (ID: ${drugCheck[0].DrugID})`);
        }

        // Check if NSSF pricing data already exists
        const [existingRecord] = await sequelize.query(
            'SELECT id FROM nssf_pricing WHERE drug_id = ? AND effective_date = ?',
            { replacements: [drugId, effectiveDate] }
        );

        if (existingRecord.length > 0) {
            console.log(`⚠️  NSSF pricing record already exists for drug ID ${drugId} on ${effectiveDate}`);
            console.log('   Updating existing record...');

            const updateSQL = `
                UPDATE nssf_pricing 
                SET 
                    public_price_lbp = ?,
                    nssf_price_lbp = ?,
                    nssf_coverage_percentage = ?,
                    nssf_coverage_amount_lbp = ?,
                    real_nssf_coverage_percentage = ?,
                    is_active = TRUE,
                    updated_at = CURRENT_TIMESTAMP
                WHERE drug_id = ? AND effective_date = ?
            `;

            await sequelize.query(updateSQL, {
                replacements: [
                    publicPriceLbp,
                    nssfPriceLbp,
                    nssfCoveragePercentage,
                    nssfCoverageAmountLbp,
                    realNssfCoveragePercentage,
                    drugId,
                    effectiveDate
                ]
            });

            console.log('✅ NSSF pricing record updated successfully!');

        } else {
            console.log('📝 Inserting new NSSF pricing record...');

            const insertSQL = `
                INSERT INTO nssf_pricing (
                    drug_id,
                    effective_date,
                    public_price_lbp,
                    nssf_price_lbp,
                    nssf_coverage_percentage,
                    nssf_coverage_amount_lbp,
                    real_nssf_coverage_percentage,
                    is_active,
                    created_at,
                    updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `;

            await sequelize.query(insertSQL, {
                replacements: [
                    drugId,
                    effectiveDate,
                    publicPriceLbp,
                    nssfPriceLbp,
                    nssfCoveragePercentage,
                    nssfCoverageAmountLbp,
                    realNssfCoveragePercentage
                ]
            });

            console.log('✅ NSSF pricing record inserted successfully!');
        }

        // Verify the insertion
        console.log('\n🔍 Verifying inserted data...');
        const [verifyData] = await sequelize.query(
            `SELECT 
                id,
                drug_id,
                effective_date,
                public_price_lbp,
                nssf_price_lbp,
                nssf_coverage_percentage,
                nssf_coverage_amount_lbp,
                real_nssf_coverage_percentage,
                is_active
            FROM nssf_pricing 
            WHERE drug_id = ? AND effective_date = ?`,
            { replacements: [drugId, effectiveDate] }
        );

        if (verifyData.length > 0) {
            const record = verifyData[0];
            console.log('✅ Data verification successful:');
            console.log(`   Record ID: ${record.id}`);
            console.log(`   Drug ID: ${record.drug_id}`);
            console.log(`   Public Price: LBP ${parseFloat(record.public_price_lbp).toLocaleString()}`);
            console.log(`   Real NSSF Coverage %: ${record.real_nssf_coverage_percentage}%`);
        }

        console.log('\n🎉 NSSF pricing data operation completed successfully!');

    } catch (error) {
        console.error('\n❌ Error with NSSF pricing data:', error.message);
        throw error;
    }
}

// Command line usage
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length < 6) {
        console.log('Usage: node insertNSSFData.js <drugId> <effectiveDate> <publicPrice> <nssfPrice> <coveragePercentage> <coverageAmount> [realCoveragePercentage]');
        console.log('');
        console.log('Example:');
        console.log('node insertNSSFData.js 6790 "2025-05-26" 596666 278606 80 222885 37.3');
        console.log('');
        console.log('Date format: YYYY-MM-DD');
        console.log('Prices: In LBP (numbers without commas)');
        console.log('Percentages: As numbers (e.g., 80 for 80%)');
        process.exit(1);
    }

    const [drugId, effectiveDate, publicPrice, nssfPrice, coveragePercentage, coverageAmount, realCoveragePercentage] = args;

    insertNSSFData(
        parseInt(drugId),
        effectiveDate,
        parseFloat(publicPrice),
        parseFloat(nssfPrice),
        parseFloat(coveragePercentage),
        parseFloat(coverageAmount),
        realCoveragePercentage ? parseFloat(realCoveragePercentage) : null
    ).then(() => {
        console.log('\n📪 Database connection closed.');
        process.exit(0);
    }).catch((error) => {
        console.error('\n📋 Full error details:');
        console.error(error);
        process.exit(1);
    }).finally(async () => {
        await sequelize.close();
    });
}

module.exports = insertNSSFData;
