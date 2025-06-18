// Node.js script to create NSSF Pricing table using existing database configuration
const path = require('path');

// Import your existing database configuration
const sequelize = require('../config/databasePharmacy');

async function createNSSFPricingTable() {
    console.log('🚀 Creating NSSF Pricing table in MySQL database...\n');

    try {
        // Test database connection first
        console.log('📡 Testing database connection...');
        await sequelize.authenticate();
        console.log('✅ Database connection successful!\n');

        console.log('🔨 Creating NSSF Pricing table using direct SQL...');

        // Create the table using direct SQL - simpler approach
        const createTableSQL = `
        CREATE TABLE IF NOT EXISTS \`nssf_pricing\` (
            \`id\` INT AUTO_INCREMENT PRIMARY KEY,
            \`drug_id\` INT NOT NULL,
            \`effective_date\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`public_price_lbp\` DECIMAL(12, 2) NULL COMMENT 'Public Price (MoPH) in LBP',
            \`nssf_price_lbp\` DECIMAL(12, 2) NULL COMMENT 'NSSF Price in LBP',
            \`nssf_coverage_percentage\` DECIMAL(5, 2) NULL COMMENT 'NSSF Coverage Percentage (e.g., 80.00 for 80%)',
            \`nssf_coverage_amount_lbp\` DECIMAL(12, 2) NULL COMMENT 'NSSF Coverage Amount in LBP',
            \`real_nssf_coverage_percentage\` DECIMAL(5, 2) NULL COMMENT 'Real NSSF Coverage Percentage per public price (MoPH) - calculated as (nssf_coverage_amount_lbp / public_price_lbp) * 100',
            \`is_active\` BOOLEAN DEFAULT TRUE COMMENT 'Whether this pricing record is currently active',
            \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
            \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            INDEX \`idx_drug_date\` (\`drug_id\`, \`effective_date\`),
            INDEX \`idx_drug_active\` (\`drug_id\`, \`is_active\`),
            UNIQUE KEY \`unique_drug_date\` (\`drug_id\`, \`effective_date\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='NSSF pricing and coverage information for drugs'
        `;

        await sequelize.query(createTableSQL);
        console.log('✅ NSSF Pricing table created successfully!');

        // Add foreign key constraint separately
        console.log('🔗 Adding foreign key constraint...');
        try {
            const addForeignKeySQL = `
            ALTER TABLE \`nssf_pricing\` 
            ADD CONSTRAINT \`fk_nssf_pricing_drug_id\` 
            FOREIGN KEY (\`drug_id\`) 
            REFERENCES \`drug\` (\`DrugID\`) 
            ON DELETE CASCADE 
            ON UPDATE CASCADE
            `;
            await sequelize.query(addForeignKeySQL);
            console.log('✅ Foreign key constraint added successfully!');
        } catch (fkError) {
            console.log('⚠️  Foreign key constraint might already exist or drug table not found:', fkError.message);
        }

        console.log('\n🎉 NSSF Pricing table setup completed successfully!');
        console.log('\n📊 Table features:');
        console.log('   ✅ All required fields for NSSF pricing data');
        console.log('   ✅ Proper indexes for performance optimization');
        console.log('   ✅ Unique constraint to prevent duplicate records');
        console.log('   ✅ Foreign key constraint to drug table (if available)');
        console.log('   ✅ Auto-timestamps for created_at and updated_at');

        // Verify table creation
        console.log('\n🔍 Verifying table structure...');
        const [results] = await sequelize.query('DESCRIBE nssf_pricing');
        console.log('✅ Table structure verified:');
        results.forEach(col => {
            console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(NOT NULL)' : '(NULL)'}`);
        });

        // Show indexes
        console.log('\n🔍 Verifying indexes...');
        const [indexes] = await sequelize.query('SHOW INDEX FROM nssf_pricing');
        console.log('✅ Indexes created:');
        const uniqueIndexes = [...new Set(indexes.map(idx => idx.Key_name))];
        uniqueIndexes.forEach(idx => {
            console.log(`   - ${idx}`);
        });

        console.log('\n🚀 You can now use the NSSF pricing functionality in your application!');
        console.log('\n💡 Note: The real_nssf_coverage_percentage calculation will be handled by your application logic.');

    } catch (error) {
        console.error('\n❌ Error creating NSSF Pricing table:', error.message);
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
    createNSSFPricingTable();
}

module.exports = createNSSFPricingTable;
