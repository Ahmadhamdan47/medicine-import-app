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
const filePath = path.join(__dirname, "February.tsv");

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

        // Step 1: Fetch existing medications
        console.log("Fetching existing medications from the database...");
        const [existingMedications] = await connection.execute(
            "SELECT code FROM medications"
        );
        const existingCodes = new Set(existingMedications.map(med => med.code));

        // Step 2: Find medications that are in the file but not in the database
        console.log("Comparing file and database data...");
        const newMedications = parsedData.filter(med => !existingCodes.has(med.code));

        console.log(`Found ${newMedications.length} new medications to add.`);

        // Step 3: Insert new medications into the database
        for (const med of newMedications) {
            await connection.execute(
                `INSERT INTO medications (
                    atc, seq, bg, ingredients, code, reg_number, brand_name, strength,
                    presentation, form, dosage_lndi, presentation_lndi, form_lndi, route_lndi,
                    agent, manufacturer, country, public_price, stratum, subsidy_percentage,
                    pill_price, barcode_gtin, added_date, modified_date, modified_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

                [
                    med.atc || null,
                    med.seq || null,
                    med.bg || null,
                    med.ingredients || null,
                    med.code || null,
                    med.reg_number || null,
                    med.brand_name || null,
                    med.strength || null,
                    med.presentation || null,
                    med.form || null,
                    med.dosage_lndi || null,
                    med.presentation_lndi || null,
                    med.form_lndi || null,
                    med.route_lndi || null,
                    med.agent || null,
                    med.manufacturer || null,
                    med.country || null,
                    parseFloat(med.public_price) || null,
                    med.stratum || null,
                    med.subsidy_percentage || null,
                    parseFloat(med.pill_price) || null,
                    med.barcode_gtin || null,
                    new Date(),
                    null,
                    null
                ]
            );
            console.log(`Added new medication: "${med.brand_name}" (code: ${med.code}).`);
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