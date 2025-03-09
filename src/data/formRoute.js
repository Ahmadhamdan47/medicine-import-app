const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'ommal_ahmad',
    password: 'fISfGr^8q!_gUPMY',
    database: 'ommal_medapiv2'
};

async function updateDrugData(filePath) {
    const connection = await mysql.createConnection(dbConfig);

    // Load the file data into a Map for quick lookup
    const fileData = fs.readFileSync(filePath, 'utf8').trim().split('\n');
    const fileMap = new Map();

    fileData.slice(1).forEach(line => { // Skip header
        const [MoPHCode, FormRaw, RouteRaw] = line.trim().split('\t');
        fileMap.set(MoPHCode, { FormRaw, RouteRaw });
    });

    try {
        // Fetch all drugs from the database
        const [drugs] = await connection.query('SELECT DrugID, MoPHCode, DFSequence FROM drug');

        const updates = [];

        for (const drug of drugs) {
            if (fileMap.has(drug.MoPHCode)) {
                const { FormRaw, RouteRaw } = fileMap.get(drug.MoPHCode);
                updates.push({
                    query: 'UPDATE drug SET FormRaw = ?, RouteRaw = ? WHERE DrugID = ?',
                    values: [FormRaw, RouteRaw, drug.DrugID]
                });
            } else {
                updates.push({
                    query: 'UPDATE drug SET DFSequence = NULL WHERE DrugID = ?',
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

const filePath = path.join(__dirname, 'FormAndRouteRaw.tsv');
updateDrugData(filePath).catch(err => console.error('Error updating drugs:', err));
