const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const csv = require('csv-parser');

// Database configuration
const dbConfig = {
    host: "localhost",
    user: "ommal_oummal",
    password: "dMR2id57dviMJJnc",
    database: "ommal_medlist",
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
const FILE_PATH = './medlist.tsv';

console.log("Reading medlist.tsv file...");
const existingCodes = new Set();

async function readTSVFile() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(FILE_PATH)
            .pipe(csv({ separator: '\t' }))
            .on('data', (row) => {
                if (row.code) {
                    existingCodes.add(row.code.trim());
                }
            })
            .on('end', () => {
                console.log(`Finished reading file. Total codes found: ${existingCodes.size}`);
                resolve();
            })
            .on('error', (error) => {
                console.error("Error reading file:", error);
                reject(error);
            });
    });
}

async function deleteMissingMedications() {
    console.log("Checking for medications to delete...");
    let successCount = 0;
    let failureCount = 0;
    let errorLog = [];

    try {
        const [allMeds] = await db.promise().query("SELECT id, code FROM medications");
        console.log(`Total medications fetched: ${allMeds.length}`);

        for (const med of allMeds) {
            if (!existingCodes.has(med.code)) {
                console.log(`Deleting Medication ID ${med.id} - Code ${med.code}`);
                try {
                    await db.promise().query("DELETE FROM medications WHERE id = ?", [med.id]);
                    console.log(`Deleted Medication ID ${med.id} - Code ${med.code}`);
                    successCount++;
                } catch (deleteError) {
                    console.error(`Error deleting Medication ID ${med.id}:`, deleteError.message);
                    failureCount++;
                    errorLog.push({ id: med.id, code: med.code, error: deleteError.message });
                }
            }
        }

        console.log(`Deletion complete: ${successCount} deletions, ${failureCount} failures`);
        fs.writeFileSync("delete_medications_log.json", JSON.stringify(errorLog, null, 2));
        console.log("Error log saved to delete_medications_log.json");
    } catch (error) {
        console.error("Unexpected error during processing:", error);
    } finally {
        console.log("Closing database connection");
        db.end();
    }
}

(async () => {
    console.log("Starting medication deletion script...");
    await readTSVFile();
    await deleteMissingMedications();
})();