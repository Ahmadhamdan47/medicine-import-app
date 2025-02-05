const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
const { parse } = require("papaparse");

// Database connection details
const dbConfig = {
    host: "localhost",       // Replace with your database host
    user: "ommal_ahmad",     // Replace with your database user
    password: "fISfGr^8q!_gUPMY", // Replace with your database password
    database: "ommal_medapiv2",  // Replace with your database name
};

// Path to the TSV file
const filePath = path.join(__dirname, "February.tsv");

// Read and parse the TSV file
const fileContent = fs.readFileSync(filePath, "utf8");
const parsedData = parse(fileContent, {
    header: true,
    delimiter: "\t",
}).data;

async function addNewDrugs() {
    let connection;

    try {
        console.log("Connecting to the database...");
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected to the database.");

        // Step 1: Fetch existing drugs
        console.log("Fetching existing drugs from the database...");
        const [existingDrugs] = await connection.execute(
            "SELECT MoPHCode FROM drug"
        );
        const existingMoPHCodes = new Set(existingDrugs.map(drug => drug.MoPHCode));

        // Step 2: Find drugs that are in the file but not in the database
        console.log("Comparing file and database data...");
        const newDrugs = parsedData.filter(drug => !existingMoPHCodes.has(drug.MoPHCode));

        console.log(`Found ${newDrugs.length} new drugs to add.`);

        // Step 3: Insert new drugs into the database
        for (const drug of newDrugs) {
            await connection.execute(
                `INSERT INTO drug (
                    ATC_Code, ProductType, OtherIngredients,
                    MoPHCode, RegistrationNumber, DrugName, Presentation,
                    Form, Route, Agent, Manufacturer, Country,
                    SubsidyPercentage, NotMarketed
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    drug.ATC_Code || null,
                    drug.ProductType || null,
                    drug.OtherIngredients || null,
                    drug.MoPHCode || null,
                    drug.RegistrationNumber || null,
                    drug.DrugName || null,
                    drug.Presentation || null,
                    drug.Form || null,
                    drug.Route || null,
                    drug.Agent || null,
                    drug.Manufacturer || null,
                    drug.Country || null,
                    parseFloat(drug.SubsidyPercentage) || 0,
                    false
                ]
            );
            console.log(`Added new drug: "${drug.DrugName}" (MoPHCode: ${drug.MoPHCode}).`);
        }

        console.log("All new drugs have been added.");

        // Step 4: Update NotMarketed to true for drugs not in the file
        const fileMoPHCodes = new Set(parsedData.map(drug => drug.MoPHCode));
        const drugsToUpdate = existingDrugs.filter(drug => !fileMoPHCodes.has(drug.MoPHCode));

        console.log(`Found ${drugsToUpdate.length} drugs to update as NotMarketed.`);

        for (const drug of drugsToUpdate) {
            await connection.execute(
                "UPDATE drug SET NotMarketed = ? WHERE MoPHCode = ?",
                [true, drug.MoPHCode]
            );
            console.log(`Updated drug as NotMarketed: MoPHCode ${drug.MoPHCode}.`);
        }

        console.log("All necessary drugs have been updated as NotMarketed.");
    } catch (error) {
        console.error("Error adding new drugs:", error);
    } finally {
        if (connection) await connection.end();
        console.log("Database connection closed.");
    }
}

addNewDrugs();