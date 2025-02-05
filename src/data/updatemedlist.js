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

// Map TSV headers to database column names
const headerMapping = {
    MoPHCode: 'code',
    ATC_Code: 'atc',
    Seq: 'seq',
    BG: 'bg',
    Ingredients: 'ingredients',
    RegistrationNumber: 'reg_number',
    DrugName: 'brand_name',
    Strength: 'strength',
    Presentation: 'presentation',
    Form: 'form',
    DosageLNDI: 'dosage_lndi',
    PresentationLNDI: 'presentation_lndi',
    FormLNDI: 'form_lndi',
    RouteLNDI: 'route_lndi',
    Agent: 'agent',
    Manufacturer: 'manufacturer',
    Country: 'country',
    PublicPrice: 'public_price',
    Stratum: 'stratum',
    SubsidyPercentage: 'subsidy_percentage',
    PillPrice: 'pill_price',
    BarcodeGTIN: 'barcode_gtin',
    AddedDate: 'added_date',
    ModifiedDate: 'modified_date',
    ModifiedBy: 'modified_by'
};

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
        const newMedications = parsedData.filter(med => !existingCodes.has(med[headerMapping.MoPHCode]));

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
                    med[headerMapping.ATC_Code] || null,
                    med[headerMapping.Seq] || null,
                    med[headerMapping.BG] || null,
                    med[headerMapping.Ingredients] || null,
                    med[headerMapping.MoPHCode] || null,
                    med[headerMapping.RegistrationNumber] || null,
                    med[headerMapping.DrugName] || null,
                    med[headerMapping.Strength] || null,
                    med[headerMapping.Presentation] || null,
                    med[headerMapping.Form] || null,
                    med[headerMapping.DosageLNDI] || null,
                    med[headerMapping.PresentationLNDI] || null,
                    med[headerMapping.FormLNDI] || null,
                    med[headerMapping.RouteLNDI] || null,
                    med[headerMapping.Agent] || null,
                    med[headerMapping.Manufacturer] || null,
                    med[headerMapping.Country] || null,
                    parseFloat(med[headerMapping.PublicPrice]) || null,
                    med[headerMapping.Stratum] || null,
                    med[headerMapping.SubsidyPercentage] || null,
                    parseFloat(med[headerMapping.PillPrice]) || null,
                    med[headerMapping.BarcodeGTIN] || null,
                    new Date(),
                    null,
                    null
                ]
            );
            console.log(`Added new medication: "${med[headerMapping.DrugName]}" (code: ${med[headerMapping.MoPHCode]}).`);
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