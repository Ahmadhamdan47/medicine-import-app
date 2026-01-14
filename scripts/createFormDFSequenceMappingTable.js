// Script to create Form to DF Sequence Mapping table
// This properly maps dosage form names to their DFSequence codes
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Create database connection directly
const sequelize = new Sequelize("ommal_medapiv2", "ommal_ahmad", "fISfGr^8q!_gUPMY", {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

async function createFormDFSequenceMappingTable() {
    try {
        console.log('🔄 Starting Form-DFSequence Mapping table creation...');
        
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        console.log('\n📋 Creating form_df_sequence_mapping table...');
        
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS form_df_sequence_mapping (
                id INT PRIMARY KEY AUTO_INCREMENT,
                form_name VARCHAR(255) NOT NULL,
                df_sequence VARCHAR(100) NOT NULL,
                sequence_number INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_form_name (form_name),
                INDEX idx_df_sequence (df_sequence),
                INDEX idx_sequence_number (sequence_number),
                UNIQUE KEY unique_form_df (form_name, df_sequence)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;
        
        await sequelize.query(createTableSQL);
        console.log('✅ form_df_sequence_mapping table created successfully');

        // Check existing data
        const [countResult] = await sequelize.query(
            'SELECT COUNT(*) as count FROM form_df_sequence_mapping'
        );
        
        if (countResult[0].count > 0) {
            console.log(`\n⚠️  Table already contains ${countResult[0].count} records.`);
            console.log('✅ Skipping import - table already populated');
            return;
        }

        // Import data
        console.log('\n📥 Importing data from Tables.csv...');
        await importCSVData();

        console.log('\n🎉 Form-DFSequence Mapping table created and populated successfully!');
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
                const sequenceNumber = row[0] ? row[0].trim() : null;
                const dfSequence = row[1] ? row[1].trim() : null;
                
                if (!sequenceNumber || !dfSequence) return;

                // Process all columns from index 2 onwards (these are form names)
                for (let i = 2; i < Object.keys(row).length; i++) {
                    const formName = row[i] ? row[i].trim() : '';
                    
                    // Skip empty values and special instructions (ADD, CHOOSE, etc.)
                    if (formName && 
                        formName.length > 0 && 
                        !formName.includes('ADD') && 
                        !formName.includes('CHOOSE') &&
                        !formName.startsWith('Add option') &&
                        !formName.startsWith('Add tick')) {
                        
                        records.push({
                            sequence_number: sequenceNumber,
                            df_sequence: dfSequence,
                            form_name: formName
                        });
                    }
                }
            })
            .on('end', async () => {
                try {
                    console.log(`📊 Found ${records.length} form-to-DFSequence mappings`);

                    if (records.length === 0) {
                        return reject(new Error('No valid records found in CSV'));
                    }

                    // Batch insert
                    const batchSize = 500;
                    let imported = 0;

                    for (let i = 0; i < records.length; i += batchSize) {
                        const batch = records.slice(i, i + batchSize);
                        
                        const values = batch.map(r => 
                            `('${r.form_name.replace(/'/g, "''")}', '${r.df_sequence.replace(/'/g, "''")}', ${r.sequence_number})`
                        ).join(',');

                        const insertSQL = `
                            INSERT INTO form_df_sequence_mapping (form_name, df_sequence, sequence_number)
                            VALUES ${values}
                            ON DUPLICATE KEY UPDATE 
                                df_sequence = VALUES(df_sequence),
                                updated_at = CURRENT_TIMESTAMP
                        `;

                        await sequelize.query(insertSQL);
                        imported += batch.length;
                        
                        process.stdout.write(`\r   Imported: ${imported}/${records.length} records`);
                    }

                    console.log('\n✅ All form mappings imported successfully');
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
        const [countResult] = await sequelize.query(
            'SELECT COUNT(*) as total FROM form_df_sequence_mapping'
        );
        console.log(`\n📊 Table Statistics:`);
        console.log(`   Total form mappings: ${countResult[0].total}`);

        const [uniqueFormsResult] = await sequelize.query(
            'SELECT COUNT(DISTINCT form_name) as unique_forms FROM form_df_sequence_mapping'
        );
        console.log(`   Unique form names: ${uniqueFormsResult[0].unique_forms}`);

        const [uniqueSeqResult] = await sequelize.query(
            'SELECT COUNT(DISTINCT df_sequence) as unique_sequences FROM form_df_sequence_mapping'
        );
        console.log(`   Unique DF Sequences: ${uniqueSeqResult[0].unique_sequences}`);

        // Sample records
        const [sampleRecords] = await sequelize.query(
            'SELECT * FROM form_df_sequence_mapping ORDER BY sequence_number, id LIMIT 10'
        );
        console.log(`\n📄 Sample records:`);
        console.table(sampleRecords);

        // Forms per DFSequence
        const [formsPerSeq] = await sequelize.query(`
            SELECT df_sequence, COUNT(*) as form_count 
            FROM form_df_sequence_mapping 
            GROUP BY df_sequence 
            ORDER BY form_count DESC 
            LIMIT 10
        `);
        console.log(`\n🔝 DFSequences with most forms:`);
        console.table(formsPerSeq);

    } catch (error) {
        console.error('Error displaying statistics:', error);
    }
}

if (require.main === module) {
    createFormDFSequenceMappingTable()
        .then(() => {
            console.log('\n✅ Script completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Script failed:', error);
            process.exit(1);
        });
}

module.exports = { createFormDFSequenceMappingTable };
