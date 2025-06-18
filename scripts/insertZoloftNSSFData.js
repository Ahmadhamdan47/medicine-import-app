// Script to insert NSSF pricing data for specific drugs
const sequelize = require('../config/databasePharmacy');

async function insertNSSFPricingData() {
    console.log('🚀 Inserting NSSF pricing data...\n');

    try {
        // Test database connection first
        console.log('📡 Testing database connection...');
        await sequelize.authenticate();
        console.log('✅ Database connection successful!\n');

        // Insert data for drug ID 6790 (Zoloft)
        const drugId = 6790;
        const effectiveDate = '2025-05-26'; // 26/05/25
        const publicPriceLbp = 596666.00;
        const nssfPriceLbp = 278606.00;
        const nssfCoveragePercentage = 80.00;
        const nssfCoverageAmountLbp = 222885.00;
        const realNssfCoveragePercentage = 37.3; // Pre-calculated value

        console.log('📝 Inserting NSSF pricing data for:');
        console.log(`   Drug ID: ${drugId} (Zoloft)`);
        console.log(`   Effective Date: ${effectiveDate}`);
        console.log(`   Public Price (MoPH): LBP ${publicPriceLbp.toLocaleString()}`);
        console.log(`   NSSF Price: LBP ${nssfPriceLbp.toLocaleString()}`);
        console.log(`   NSSF Coverage Percentage: ${nssfCoveragePercentage}%`);
        console.log(`   NSSF Coverage Amount: LBP ${nssfCoverageAmountLbp.toLocaleString()}`);
        console.log(`   Real NSSF Coverage Percentage: ${realNssfCoveragePercentage}%\n`);

        // First, check if the drug exists
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

        // Check if NSSF pricing data already exists for this drug and date
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
                is_active,
                created_at,
                updated_at
            FROM nssf_pricing 
            WHERE drug_id = ? AND effective_date = ?`,
            { replacements: [drugId, effectiveDate] }
        );

        if (verifyData.length > 0) {
            const record = verifyData[0];
            console.log('✅ Data verification successful:');
            console.log(`   Record ID: ${record.id}`);
            console.log(`   Drug ID: ${record.drug_id}`);
            console.log(`   Effective Date: ${record.effective_date}`);
            console.log(`   Public Price: LBP ${parseFloat(record.public_price_lbp).toLocaleString()}`);
            console.log(`   NSSF Price: LBP ${parseFloat(record.nssf_price_lbp).toLocaleString()}`);
            console.log(`   NSSF Coverage %: ${record.nssf_coverage_percentage}%`);
            console.log(`   NSSF Coverage Amount: LBP ${parseFloat(record.nssf_coverage_amount_lbp).toLocaleString()}`);
            console.log(`   Real NSSF Coverage %: ${record.real_nssf_coverage_percentage}%`);
            console.log(`   Active: ${record.is_active ? 'Yes' : 'No'}`);
        }

        console.log('\n🎉 NSSF pricing data insertion completed successfully!');
        console.log('\n🚀 You can now fetch this data using the drug service APIs!');

        // Test fetching the data using drug service
        console.log('\n🧪 Testing data retrieval...');
        try {
            const DrugService = require('../src/services/drugService');
            const drugData = await DrugService.getDrugById(drugId.toString());
            
            if (drugData && drugData.length > 0 && drugData[0].nssfPricing) {
                console.log('✅ NSSF data successfully retrieved via drug service:');
                const nssfData = drugData[0].nssfPricing;
                console.log(`   Public Price: LBP ${parseFloat(nssfData.public_price_lbp).toLocaleString()}`);
                console.log(`   Real Coverage %: ${nssfData.real_nssf_coverage_percentage}%`);
            } else {
                console.log('⚠️  NSSF data not found in drug service response (this might be normal if the drug service has specific filters)');
            }
        } catch (testError) {
            console.log('⚠️  Could not test drug service (this is normal):', testError.message);
        }

    } catch (error) {
        console.error('\n❌ Error inserting NSSF pricing data:', error.message);
        console.error('\n📋 Full error details:');
        console.error(error);
        process.exit(1);
    } finally {
        // Close database connection
        await sequelize.close();
        console.log('\n📪 Database connection closed.');
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n\n⚠️  Process interrupted. Closing database connection...');
    await sequelize.close();
    process.exit(0);
});

// Run the script
if (require.main === module) {
    insertNSSFPricingData();
}

module.exports = insertNSSFPricingData;
