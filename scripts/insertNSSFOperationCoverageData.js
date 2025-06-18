const sequelize = require('../config/databasePharmacy');
const NSSFOperationCoverage = require('../src/models/nssfOperationCoverage');
const Operation = require('../src/models/operation');

async function insertNSSFOperationCoverageData() {
    try {
        console.log('Inserting NSSF Operation Coverage data...');
        
        // Sample NSSF Operation Coverage data
        const nssfCoverageData = [
            {
                operation_id: 1, // Replace with actual operation ID
                effective_date: new Date(),
                // Private Hospital Coverage
                private_operation_cost_lbp: 5000000.00, // 5M LBP
                private_nssf_coverage_percentage: 80.00, // 80%
                private_nssf_coverage_amount_lbp: 4000000.00, // 4M LBP
                // Public Hospital Coverage  
                public_operation_cost_lbp: 3000000.00, // 3M LBP
                public_nssf_coverage_percentage: 90.00, // 90%
                public_nssf_coverage_amount_lbp: 2700000.00, // 2.7M LBP
                // Category-specific coverage
                category1_nssf_coverage_lbp: 2700000.00,
                category2_nssf_coverage_lbp: 2400000.00,
                category3_nssf_coverage_lbp: 2100000.00,
                is_active: true,
                notes: 'Sample coverage for operation 1'
            },
            {
                operation_id: 2, // Replace with actual operation ID
                effective_date: new Date(),
                // Private Hospital Coverage
                private_operation_cost_lbp: 7500000.00, // 7.5M LBP
                private_nssf_coverage_percentage: 75.00, // 75%
                private_nssf_coverage_amount_lbp: 5625000.00, // 5.625M LBP
                // Public Hospital Coverage
                public_operation_cost_lbp: 4500000.00, // 4.5M LBP
                public_nssf_coverage_percentage: 85.00, // 85%
                public_nssf_coverage_amount_lbp: 3825000.00, // 3.825M LBP
                // Category-specific coverage
                category1_nssf_coverage_lbp: 3825000.00,
                category2_nssf_coverage_lbp: 3400000.00,
                category3_nssf_coverage_lbp: 3000000.00,
                is_active: true,
                notes: 'Sample coverage for operation 2'
            }
        ];

        // Check if operations exist before inserting
        const operations = await Operation.findAll({ limit: 5 });
        console.log(`Found ${operations.length} operations in database`);

        if (operations.length === 0) {
            console.log('⚠️  No operations found in database. Please add operations first.');
            return;
        }

        // Update operation IDs with actual existing operations
        for (let i = 0; i < Math.min(nssfCoverageData.length, operations.length); i++) {
            nssfCoverageData[i].operation_id = operations[i].ID;
            nssfCoverageData[i].notes = `Sample NSSF coverage for operation: ${operations[i].Name || operations[i].Code}`;
        }

        // Insert the data
        const createdRecords = await NSSFOperationCoverage.bulkCreate(nssfCoverageData, {
            updateOnDuplicate: ['effective_date', 'private_operation_cost_lbp', 'private_nssf_coverage_percentage', 
                              'private_nssf_coverage_amount_lbp', 'public_operation_cost_lbp', 'public_nssf_coverage_percentage',
                              'public_nssf_coverage_amount_lbp', 'category1_nssf_coverage_lbp', 'category2_nssf_coverage_lbp',
                              'category3_nssf_coverage_lbp', 'is_active', 'notes']
        });

        console.log(`✅ Successfully inserted ${createdRecords.length} NSSF Operation Coverage records!`);
        
        // Verify the data
        const totalCount = await NSSFOperationCoverage.count();
        console.log(`📊 Total NSSF Operation Coverage records in database: ${totalCount}`);

        // Show sample data
        const sampleRecord = await NSSFOperationCoverage.findOne({
            include: [{
                model: Operation,
                as: 'operation',
                attributes: ['ID', 'Name', 'Code']
            }]
        });

        if (sampleRecord) {
            console.log('\n📋 Sample NSSF Operation Coverage record:');
            console.log(`Operation: ${sampleRecord.operation?.Name || sampleRecord.operation?.Code} (ID: ${sampleRecord.operation_id})`);
            console.log(`Private Cost: ${sampleRecord.private_operation_cost_lbp} LBP`);
            console.log(`Private NSSF Coverage: ${sampleRecord.private_nssf_coverage_percentage}% (${sampleRecord.private_nssf_coverage_amount_lbp} LBP)`);
            console.log(`Private Patient Share: ${sampleRecord.private_patient_share_lbp} LBP`);
            console.log(`Public Cost: ${sampleRecord.public_operation_cost_lbp} LBP`);
            console.log(`Public NSSF Coverage: ${sampleRecord.public_nssf_coverage_percentage}% (${sampleRecord.public_nssf_coverage_amount_lbp} LBP)`);
            console.log(`Public Patient Share: ${sampleRecord.public_patient_share_lbp} LBP`);
        }

    } catch (error) {
        console.error('❌ Error inserting NSSF Operation Coverage data:', error);
        throw error;
    } finally {
        await sequelize.close();
    }
}

// Run the function
if (require.main === module) {
    insertNSSFOperationCoverageData()
        .then(() => {
            console.log('Script completed successfully.');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Script failed:', error);
            process.exit(1);
        });
}

module.exports = insertNSSFOperationCoverageData;
