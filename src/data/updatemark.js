const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const csv = require('csv-parser');

// Database configuration
const dbConfig = {
    host: "localhost",
    user: "ommal_ahmad",
    password: "fISfGr^8q!_gUPMY",
    database: "ommal_medapiv2",
};

const db = mysql.createConnection(dbConfig);
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
    console.log("Connected to the database");
});

// Path to the TSV file
const FILE_PATH = './mark.tsv';

console.log("Reading mark.tsv file...");
const MoPHCodes = new Set();

async function readTSVFile() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(FILE_PATH)
            .pipe(csv({ separator: '\t' }))
            .on('data', (row) => {
                if (row.MoPHCode) {
                    MoPHCodes.add(row.MoPHCode.trim());
                }
            })
            .on('end', () => {
                console.log(`Finished reading file. Total MoPHCodes found: ${MoPHCodes.size}`);
                resolve();
            })
            .on('error', (error) => {
                console.error("Error reading file:", error);
                reject(error);
            });
    });
}

async function updateNotMarketed() {
    console.log("Updating NotMarketed flag in drug table...");
    let successCount = 0;
    let failureCount = 0;
    let errorLog = [];

    try {
        const [allDrugs] = await db.promise().query("SELECT DrugID, MoPHCode, NotMarketed FROM drug");
        console.log(`Total drugs fetched: ${allDrugs.length}`);

        for (const drug of allDrugs) {
            const newStatus = MoPHCodes.has(drug.MoPHCode) ? false : true;
            console.log(`Processing DrugID ${drug.DrugID} - MoPHCode ${drug.MoPHCode} - Current NotMarketed: ${drug.NotMarketed} - New NotMarketed: ${newStatus}`);
            
            if (newStatus !== drug.NotMarketed) {
                try {
                    await db.promise().query("UPDATE drug SET NotMarketed = ? WHERE DrugID = ?", [newStatus, drug.DrugID]);
                    console.log(`Updated DrugID ${drug.DrugID} - MoPHCode ${drug.MoPHCode} - NotMarketed = ${newStatus}`);
                    successCount++;
                } catch (updateError) {
                    console.error(`Error updating DrugID ${drug.DrugID}:`, updateError.message);
                    failureCount++;
                    errorLog.push({ DrugID: drug.DrugID, MoPHCode: drug.MoPHCode, error: updateError.message });
                }
            }
        }

        console.log(`Update complete: ${successCount} successes, ${failureCount} failures`);
        fs.writeFileSync("update_NotMarketed_log.json", JSON.stringify(errorLog, null, 2));
        console.log("Error log saved to update_NotMarketed_log.json");
    } catch (error) {
        console.error("Unexpected error during processing:", error);
    } finally {
        console.log("Closing database connection");
        db.end();
    }
}

(async () => {
    console.log("Starting NotMarketed update script...");
    await readTSVFile();
    await updateNotMarketed();
})();
