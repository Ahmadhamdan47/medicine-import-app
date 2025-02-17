const fs = require('fs');
const mysql = require('mysql2');
const path = require('path');

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ommal_medlist',
};

const db = mysql.createConnection(dbConfig);
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
    console.log("Connected to the database");
});

const outputFilePath = path.join(__dirname, 'medications.csv');

async function exportMedications() {
    try {
        console.log("Fetching data from medications table...");
        
        const rows = await new Promise((resolve, reject) => {
            db.query("SELECT code AS MoPHCode, barcode_gtin AS GTIN FROM medications", (err, results) => {
                if (err) return reject(err);
                if (!Array.isArray(results)) return reject(new Error("Invalid data format received from database"));
                resolve(results);
            });
        });
        
        if (!rows || rows.length === 0) {
            console.log("No data found in medications table.");
            return;
        }
        
        console.log("Writing data to CSV file...");
        const csvContent = ["MoPHCode,GTIN"];
        rows.forEach(row => {
            csvContent.push(`${row.MoPHCode || ''},${row.GTIN || ''}`);
        });
        
        fs.writeFileSync(outputFilePath, csvContent.join('\n'));
        console.log(`Data successfully written to ${outputFilePath}`);
    } catch (error) {
        console.error("Error exporting medications:", error);
    } finally {
        console.log("Closing database connection");
        db.end();
    }
}

// Run the script
console.log("Starting medication export script...");
exportMedications();
