const fs = require('fs');
const csv = require('csv-parser');
const mysql = require('mysql2/promise');

async function readTsv(filePath) {
    const tsvData = {};
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv({ separator: '\t' }))
            .on('data', (row) => {
                try {
                    const mophCode = row['MoPHCode'].trim();
                    const form = row['Form'].trim();
                    tsvData[mophCode] = form;
                } catch (error) {
                    console.log(`Skipping invalid row: ${JSON.stringify(row)}`);
                }
            })
            .on('end', () => {
                resolve(tsvData);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

async function getDbConnection() {
    try {
        return await mysql.createConnection({
            host: 'localhost',
            user: 'ommal_ahmad',
            password: 'fISfGr^8q!_gUPMY',
            database: 'ommal_medapiv2'
        });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return null;
    }
}

async function main() {
    const tsvData = await readTsv('RPFD.tsv');
    const conn = await getDbConnection();
    if (!conn) {
        console.log("Failed to connect to the database.");
        return;
    }

    try {
        await conn.beginTransaction();

        // Fetch current data from the database
        const [rows] = await conn.execute("SELECT MoPHCode, Form FROM drug");
        const currentData = {};
        rows.forEach(row => {
            currentData[row.MoPHCode.trim()] = row.Form;
        });

        // Calculate changes
        const updateList = [];
        for (const [code, newForm] of Object.entries(tsvData)) {
            const currentForm = currentData[code];
            if (currentForm !== newForm) {
                updateList.push([newForm, code]);
            }
        }

        // Show preview
        console.log("\n===== Changes Preview =====");
        console.log(`Updates to perform: ${updateList.length}`);
        if (updateList.length > 0) {
            console.log("Sample updates:");
            updateList.slice(0, 3).forEach(update => {
                console.log(`Code ${update[1]}: '${currentData[update[1]]}' → '${update[0]}'`);
            });
        }

        // Confirmation
        const confirm = require('readline-sync').question("\nDo you want to commit these changes? (yes/no): ").toLowerCase();
        if (confirm !== 'yes') {
            await conn.rollback();
            console.log("Transaction rolled back");
            return;
        }

        // Execute updates
        if (updateList.length > 0) {
            const updateQuery = "UPDATE drug SET Form = ? WHERE MoPHCode = ?";
            await conn.query(updateQuery, [updateList]);
        }

        await conn.commit();
        console.log(`Successfully committed ${updateList.length} changes`);

    } catch (error) {
        console.error(`Database error: ${error.message}`);
        await conn.rollback();
    } finally {
        await conn.end();
    }
}

main().catch(error => console.error(error));