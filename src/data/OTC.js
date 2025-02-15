const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const { parse } = require('papaparse');

// Database configuration
const dbConfig = {
    host: "localhost",       // Replace with your database host
    user: "ommal_ahmad",     // Replace with your database user
    password: "fISfGr^8q!_gUPMY", // Replace with your database password
    database: "ommal_medapiv2",  // Replace with your database name
};

const db = mysql.createConnection(dbConfig);
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
    console.log("Connected to the database");
});

// Path to the CSV file
const filePath = path.join(__dirname, 'OTC.csv');

// Read and parse the CSV file
console.log("Reading OTC.csv file...");
const fileContent = fs.readFileSync(filePath, 'utf8');
const parsedData = parse(fileContent, {
  header: true,
  delimiter: ',',
}).data;
console.log("CSV file parsed successfully");

async function updateIsOTC() {
    console.log("Updating isOTC flag in drug table...");
    let successCount = 0;
    let failureCount = 0;
    let errorLog = [];
    
    try {
        for (const record of parsedData) {
            const { MoPHCode } = record;
            
            if (!MoPHCode) {
                console.log(`Skipping record with missing MoPHCode`);
                continue;
            }
            
            console.log(`Updating isOTC for MoPHCode: ${MoPHCode}`);
            
            try {
                await new Promise((resolve, reject) => {
                    db.query(
                        `UPDATE drug SET isOTC = 1 WHERE MoPHCode = ?`,
                        [MoPHCode],
                        (err, results) => {
                            if (err) {
                                failureCount++;
                                errorLog.push({ MoPHCode, error: err.message });
                                reject(err);
                            } else if (results.affectedRows === 0) {
                                failureCount++;
                                errorLog.push({ MoPHCode, error: "No matching record found" });
                                resolve();
                            } else {
                                successCount++;
                                resolve();
                            }
                        }
                    );
                });
            } catch (updateError) {
                console.log(`Error updating MoPHCode: ${MoPHCode} - ${updateError.message}`);
                failureCount++;
                errorLog.push({ MoPHCode, error: updateError.message });
            }
        }

        console.log(`Update complete: ${successCount} successes, ${failureCount} failures`);
        fs.writeFileSync('update_isOTC_log.json', JSON.stringify(errorLog, null, 2));
        console.log("Error log saved to update_isOTC_log.json");
    } catch (error) {
        console.error("Unexpected error during processing:", error);
    } finally {
        console.log("Closing database connection");
        db.end();
    }
}

// Run the script
console.log("Starting isOTC update script...");
updateIsOTC();