// Script to create DF Sequence Mapping table and populate it from CSV
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Create database connection directly (avoiding config file with winston issues)
const sequelize = new Sequelize("ommal_medapiv2", "ommal_ahmad", "fISfGr^8q!_gUPMY", {
    host: 'localhost',
    dialect: 'mysql',
    logging: false // Disable logging to avoid winston dependency
});

async function createDFSequenceMappingTable() {
    try {
        console.log('🔄 Starting DF Sequence Mapping table creation...');
        
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        // Create the table
        console.log('\n📋 Creating df_sequence_mapping table...');
        
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS df_sequence_mapping (
                id INT PRIMARY KEY AUTO_INCREMENT,
                moph_code VARCHAR(50) NOT NULL UNIQUE,
                df_sequence VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_moph_code (moph_code),
                INDEX idx_df_sequence (df_sequence)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;
        
        await sequelize.query(createTableSQL);
        console.log('✅ df_sequence_mapping table created successfully');

        // Check if table already has data
        const [countResult] = await sequelize.query(
            'SELECT COUNT(*) as count FROM df_sequence_mapping'
        );
        
        const existingCount = countResult[0].count;
        
        if (existingCount > 0) {
            console.log(`\n⚠️  Table already contains ${existingCount} records.`);
            console.log('Do you want to:');
            console.log('  1. Skip import (keep existing data)');
            console.log('  2. Clear and reimport all data');
            console.log('  3. Update existing and add new records');
            
            // For automated script, we'll skip if data exists
            console.log('\n✅ Skipping import - table already populated');
            return;
        }

        // Import data from CSV
        console.log('\n📥 Importing data from Tables.csv...');
        await importCSVData();

        console.log('\n🎉 DF Sequence Mapping table created and populated successfully!');
        
        // Display statistics
        await displayStatistics();

    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    } finally {
        await sequelize.close();
        console.log('\n🔒 Database connection closed.');
    }
}

async function importCSVData() {
    return new Promise((resolve, reject) => {
        const csvPath = path.join(__dirname, '../src/data/Tables.csv');
        const records = [];

        if (!fs.existsSync(csvPath)) {
            return reject(new Error(`CSV file not found at: ${csvPath}`));
        }

        fs.createReadStream(csvPath)
            .pipe(csv({ headers: false }))
            .on('data', (row) => {
                // CSV has no headers, columns are: [0] = MoPHCode, [1] = DFSequence, [2+] = Form descriptions
                // Only take first two columns: MoPHCode (column 0) and DFSequence (column 1)
                if (row[0] && row[1]) {
                    records.push({
                        moph_code: row[0].trim(),
                        df_sequence: row[1].trim()
                    });
                }
            })
            .on('end', async () => {
                try {
                    console.log(`📊 Found ${records.length} records in CSV`);

                    if (records.length === 0) {
                        return reject(new Error('No valid records found in CSV'));
                    }

                    // Batch insert for better performance
                    const batchSize = 500;
                    let imported = 0;

                    for (let i = 0; i < records.length; i += batchSize) {
                        const batch = records.slice(i, i + batchSize);
                        
                        // Build bulk insert query
                        const values = batch.map(r => 
                            `('${r.moph_code.replace(/'/g, "''")}', '${r.df_sequence.replace(/'/g, "''")}')`
                        ).join(',');

                        const insertSQL = `
                            INSERT INTO df_sequence_mapping (moph_code, df_sequence)
                            VALUES ${values}
                            ON DUPLICATE KEY UPDATE 
                                df_sequence = VALUES(df_sequence),
                                updated_at = CURRENT_TIMESTAMP
                        `;

                        await sequelize.query(insertSQL);
                        imported += batch.length;
                        
                        process.stdout.write(`\r   Imported: ${imported}/${records.length} records`);
                    }

                    console.log('\n✅ All records imported successfully');
                    resolve();
                } catch (error) {
                    reject(error);
                }
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

async function displayStatistics() {
    try {
        // Total count
        const [countResult] = await sequelize.query(
            'SELECT COUNT(*) as total FROM df_sequence_mapping'
        );
        console.log(`\n📊 Table Statistics:`);
        console.log(`   Total records: ${countResult[0].total}`);

        // Unique DFSequence values
        const [uniqueSeqResult] = await sequelize.query(
            'SELECT COUNT(DISTINCT df_sequence) as unique_sequences FROM df_sequence_mapping'
        );
        console.log(`   Unique DF Sequences: ${uniqueSeqResult[0].unique_sequences}`);

        // Sample records
        const [sampleRecords] = await sequelize.query(
            'SELECT * FROM df_sequence_mapping ORDER BY id LIMIT 5'
        );
        console.log(`\n📄 Sample records:`);
        console.table(sampleRecords);

        // Most common DFSequences
        const [commonSeq] = await sequelize.query(`
            SELECT df_sequence, COUNT(*) as count 
            FROM df_sequence_mapping 
            GROUP BY df_sequence 
            ORDER BY count DESC 
            LIMIT 10
        `);
        console.log(`\n🔝 Top 10 most common DF Sequences:`);
        console.table(commonSeq);

    } catch (error) {
        console.error('Error displaying statistics:', error);
    }
}

// Run the script
if (require.main === module) {
    createDFSequenceMappingTable()
        .then(() => {
            console.log('\n✅ Script completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Script failed:', error);
            process.exit(1);
        });
}

module.exports = { createDFSequenceMappingTable };
