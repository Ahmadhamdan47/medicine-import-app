const sequelize = require('../config/databasePharmacy');
const NSSFOperationCoverage = require('../src/models/nssfOperationCoverage');

async function createNSSFOperationCoverageTable() {
    try {
        console.log('Creating NSSF Operation Coverage table...');
        
        // Force sync to create table (drop if exists and recreate)
        await NSSFOperationCoverage.sync({ force: false });
        
        console.log('✅ NSSF Operation Coverage table created successfully!');
        
        // Check if table has any data
        const count = await NSSFOperationCoverage.count();
        console.log(`📊 Current NSSF Operation Coverage records: ${count}`);
        
    } catch (error) {
        console.error('❌ Error creating NSSF Operation Coverage table:', error);
        throw error;
    } finally {
        await sequelize.close();
    }
}

// Run the function
if (require.main === module) {
    createNSSFOperationCoverageTable()
        .then(() => {
            console.log('Script completed successfully.');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Script failed:', error);
            process.exit(1);
        });
}

module.exports = createNSSFOperationCoverageTable;
