// Node.js script to add real_nssf_coverage column to nssf_pricing table
// This script uses your existing database configuration

const sequelize = require('../config/databasePharmacy');

async function addRealNSSFCoverageColumn() {
    try {
        console.log('🔄 Adding real_nssf_coverage column to nssf_pricing table...');
        
        // Add the new column
        await sequelize.query(`
            ALTER TABLE nssf_pricing 
            ADD COLUMN real_nssf_coverage DECIMAL(12, 2) NULL 
            COMMENT 'Real NSSF Coverage Amount (non-percentage) in LBP' 
            AFTER real_nssf_coverage_percentage
        `);
        
        console.log('✅ Successfully added real_nssf_coverage column!');
        
        // Update existing records
        console.log('🔄 Updating existing records...');
        const [results] = await sequelize.query(`
            UPDATE nssf_pricing 
            SET real_nssf_coverage = nssf_coverage_amount_lbp 
            WHERE real_nssf_coverage IS NULL 
            AND nssf_coverage_amount_lbp IS NOT NULL
        `);
        
        console.log(`✅ Updated ${results.affectedRows} existing records`);
        
        // Show table structure
        console.log('📋 Updated table structure:');
        const [tableInfo] = await sequelize.query('DESCRIBE nssf_pricing');
        console.table(tableInfo);
        
        // Show sample data
        console.log('📊 Sample data:');
        const [sampleData] = await sequelize.query(`
            SELECT 
                id,
                drug_id,
                public_price_lbp,
                nssf_coverage_amount_lbp,
                real_nssf_coverage_percentage,
                real_nssf_coverage,
                is_active
            FROM nssf_pricing 
            LIMIT 5
        `);
        console.table(sampleData);
        
    } catch (error) {
        if (error.original && error.original.code === 'ER_DUP_FIELDNAME') {
            console.log('ℹ️  Column real_nssf_coverage already exists');
        } else {
            console.error('❌ Error adding column:', error.message);
            throw error;
        }
    } finally {
        await sequelize.close();
        console.log('🔒 Database connection closed');
    }
}

// Run the migration
addRealNSSFCoverageColumn()
    .then(() => {
        console.log('🎉 Migration completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Migration failed:', error);
        process.exit(1);
    });
