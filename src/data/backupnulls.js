const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const { createObjectCsvWriter } = require('csv-writer');

// Database Connection Configuration
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ommal_medapiv2'
});

// Connect to MySQL
connection.connect(err => {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Connected to MySQL database.");
});

// Query to fetch all columns where GTIN is NULL or 0 and NotMarketed is FALSE
const query = "SELECT * FROM drug WHERE (GTIN IS NULL OR GTIN = 0) AND NotMarketed = FALSE";

connection.query(query, (err, results, fields) => {
    if (err) {
        console.error("Error fetching data:", err);
        connection.end();
        return;
    }

    // Filter out rows where the Country field is empty
    const filteredResults = results.filter(row => row.Country && row.Country.trim() !== '');

    if (filteredResults.length === 0) {
        console.log("No drugs found where GTIN is NULL or 0, NotMarketed is FALSE, and Country is not empty.");
        connection.end();
        return;
    }

    // Define CSV file path
    const filePath = path.join(__dirname, 'backup_drugs_null_or_0_not_marketed_false.csv');

    // Generate CSV header dynamically from table column names
    const csvHeader = fields.map(field => ({ id: field.name, title: field.name }));

    // Define CSV Writer
    const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: csvHeader
    });

    // Write to CSV file
    csvWriter.writeRecords(filteredResults)
        .then(() => {
            console.log(`Backup successful! File saved at: ${filePath}`);
        })
        .catch(err => {
            console.error("Error writing to CSV:", err);
        })
        .finally(() => {
            connection.end(); // Close DB connection
        });
});