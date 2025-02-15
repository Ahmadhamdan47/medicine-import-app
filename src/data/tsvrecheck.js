const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const { parse } = require('papaparse');

// Database configuration
const dbConfig = {
    host: "localhost",       // Replace with your database host
    user: "root",     // Replace with your database user
    password: "", // Replace with your database password
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

// Path to the TSV file
const filePath = path.join(__dirname, 'medleb.tsv');

// Read and parse the TSV file
console.log("Reading TSV file...");
const fileContent = fs.readFileSync(filePath, 'utf8');
const parsedData = parse(fileContent, {
  header: true,
  delimiter: '\t',
}).data;
console.log("TSV file parsed successfully");

async function updateDrugData() {
    console.log("Updating drug data (Price & ATC_Code)...");
    let successCount = 0;
    let failureCount = 0;
    let errorLog = [];
    
    try {
        for (const record of parsedData) {
            const { MoPHCode, Price, ATC_Code } = record;
            const publicPrice = isNaN(parseFloat(Price)) ? null : parseFloat(Price) / 89500;
            
            if (!MoPHCode) {
                console.log(`Skipping record with missing MoPHCode`);
                continue;
            }
            
            console.log(`Processing MoPHCode: ${MoPHCode}`);
            
            try {
                await new Promise((resolve, reject) => {
                    db.query(
                        `UPDATE drug SET Price = ?, ATC_Code = ? WHERE MoPHCode = ?`,
                        [publicPrice, ATC_Code, MoPHCode],
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
                console.log(`Updated MoPHCode: ${MoPHCode}`);
            } catch (updateError) {
                console.log(`Error updating MoPHCode: ${MoPHCode} - ${updateError.message}`);
                failureCount++;
                errorLog.push({ MoPHCode, error: updateError.message });
            }
        }

        console.log(`Update complete: ${successCount} successes, ${failureCount} failures`);
        fs.writeFileSync('update_errors_log.json', JSON.stringify(errorLog, null, 2));
        console.log("Error log saved to update_errors_log.json");
    } catch (error) {
        console.error("Unexpected error during processing:", error);
    } finally {
        console.log("Closing database connection");
        db.end();
    }
}

// Run the script
console.log("Starting drug data update script...");
updateDrugData();

