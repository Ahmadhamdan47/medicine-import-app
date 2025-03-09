const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database'
};

async function clearFormAndRoute(filePath) {
    const connection = await mysql.createConnection(dbConfig);

    // Load the file data into a Set for fast lookup
    const fileData = fs.readFileSync(filePath, 'utf8').trim().split('\n');
    const existingMoPHCodes = new Set(fileData.slice(1).map(line => line.trim().split('\t')[0])); // Skip header

    try {
        // Fetch all MoPHCodes from the database
        const [drugs] = await connection.query('SELECT DrugID, MoPHCode FROM drug');

        const updates = [];

        for (const drug of drugs) {
            if (!existingMoPHCodes.has(drug.MoPHCode)) {
                updates.push({
                    query: 'UPDATE drug SET Form = "", Route = "" WHERE DrugID = ?',
                    values: [drug.DrugID]
                });
            }
        }

        // Execute updates in batches to avoid overload
        const batchSize = 500;
        for (let i = 0; i < updates.length; i += batchSize) {
            const batch = updates.slice(i, i + batchSize);
            await Promise.all(batch.map(update =>
                connection.query(update.query, update.values)
            ));
            console.log(`✅ Processed ${i + batch.length} / ${updates.length}`);
        }

        console.log('✅ Data update complete.');
    } catch (error) {
        console.error('❌ Error during data update:', error);
    } finally {
        await connection.end();
    }
}

const filePath = path.join(__dirname, 'routenull.tsv');
clearFormAndRoute(filePath).catch(err => console.error('Error updating drugs:', err));
