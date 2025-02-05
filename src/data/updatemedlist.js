const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
const { parse } = require("papaparse");

// Database connection details for medlist
const dbConfig = {
    host: 'localhost',
    user: 'ommal_oummal',
    password: 'dMR2id57dviMJJnc',
    database: 'ommal_medlist',
};

// Path to the TSV file
const filePath = path.join(__dirname, "febmedlist.tsv");

// Read and parse the TSV file
const fileContent = fs.readFileSync(filePath, "utf8");
const parsedData = parse(fileContent, {
    header: true,
    delimiter: "\t",
}).data;

async function updateMedications() {
    let connection;

    try {
        console.log("Connecting to the database...");
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected to the database.");

        // Step 1: Fetch the highest existing ID
        console.log("Fetching the highest existing ID from the database...");
        const [result] = await connection.execute("SELECT MAX(id) as maxId FROM medications");
        let newId = result[0].maxId + 1;

        // Step 2: Insert new medications into the database
        for (const med of parsedData) {
            await connection.execute(
                `INSERT INTO medications (
                    id, code, reg_number, brand_name, strength, presentation, form, agent, manufacturer, country, public_price, stratum
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    newId++,
                    med['code'] || null,
                    med['reg_number'] || null,
                    med['brand_name'] || null,
                    med['strength'] || null,
                    med['presentation'] || null,
                    med['form'] || null,
                    med['agent'] || null,
                    med['manufacturer'] || null,
                    med['country'] || null,
                    med['public_price'] || null,
                    med['stratum'] || null
                ]
            );
            console.log(`Added new medication: "${med['brand_name']}" (code: ${med['code']}).`);
        }

        console.log("All new medications have been added.");

    } catch (error) {
        console.error("Error updating medications:", error);
    } finally {
        if (connection) await connection.end();
        console.log("Database connection closed.");
    }
}

updateMedications();