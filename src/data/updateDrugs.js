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
const filePath = path.join(__dirname, "finalDrugData.tsv");

// Read and parse the TSV file
const fileContent = fs.readFileSync(filePath, "utf8");
const parsedData = parse(fileContent, {
    header: true,
    delimiter: "\t",
}).data;

async function updateDrugData() {
    let connection;

    try {
        console.log("Starting the drug update process...");

        // Step 1: Connect to the database
        console.log("Connecting to the database...");
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected to the database.");

        // Step 2: Fetch existing drugs
        console.log("Fetching existing drugs from the database...");
        const [existingDrugs] = await connection.execute(
            "SELECT MoPHCode, DrugName FROM drug"
        );
        console.log(`Fetched ${existingDrugs.length} existing drugs.`);

        const existingMoPHCodes = new Set(existingDrugs.map(drug => drug.MoPHCode));
        const fileMoPHCodes = new Set(parsedData.map(drug => drug.MoPHCode));

        // Step 3: Classify drugs
        console.log("Classifying drugs...");
        const toUpdateNotMarketedFalse = [...existingMoPHCodes].filter(code =>
            fileMoPHCodes.has(code)
        );
        const toUpdateNotMarketedTrue = [...existingMoPHCodes].filter(
            code => !fileMoPHCodes.has(code)
        );
        const toAdd = [...fileMoPHCodes].filter(code => !existingMoPHCodes.has(code));

        console.log(`Drugs to mark as NotMarketed = false: ${toUpdateNotMarketedFalse.length}`);
        console.log(`Drugs to mark as NotMarketed = true: ${toUpdateNotMarketedTrue.length}`);
        console.log(`Drugs to add: ${toAdd.length}`);

        const addedDrugs = [];
        const notMarketedDrugs = [];

        // Step 4: Update NotMarketed to false for matches
        console.log("Updating drugs to NotMarketed = false...");
        for (const code of toUpdateNotMarketedFalse) {
            await connection.execute(
                "UPDATE drug SET NotMarketed = false WHERE MoPHCode = ?",
                [code]
            );
            console.log(`Updated drug with MoPHCode ${code} to NotMarketed = false.`);
        }

        // Step 5: Update NotMarketed to true for non-matches
        console.log("Updating drugs to NotMarketed = true...");
        for (const code of toUpdateNotMarketedTrue) {
            await connection.execute(
                "UPDATE drug SET NotMarketed = true WHERE MoPHCode = ?",
                [code]
            );
            const drug = existingDrugs.find(d => d.MoPHCode === code);
            if (drug) {
                notMarketedDrugs.push(drug.DrugName);
                console.log(`Updated drug "${drug.DrugName}" (MoPHCode: ${code}) to NotMarketed = true.`);
            }
        }

        // Step 6: Insert new drugs with all columns
        console.log("Adding new drugs to the database...");
        for (const code of toAdd) {
            const drugData = parsedData.find(drug => drug.MoPHCode === code);
            if (drugData) {
                await connection.execute(
                    `INSERT INTO drug (
                        ATC_Code, ProductType, OtherIngredients,
                        MoPHCode, RegistrationNumber, DrugName, Presentation,
                        Form, FormLNDI, Route, Agent, Manufacturer, Country,
                        SubsidyPercentage, NotMarketed
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, false)`,
                    [
                        drugData.ATC_Code,
                        drugData.ProductType,
                        drugData.OtherIngredients,
                        drugData.MoPHCode,
                        drugData.RegistrationNumber,
                        drugData.DrugName,
                        drugData.Presentation,
                        drugData.Form,
                        drugData.FormLNDI,
                        drugData.Route,
                        drugData.Agent,
                        drugData.Manufacturer,
                        drugData.Country,
                        parseFloat(drugData.SubsidyPercentage) || 0,
                    ]
                );
                addedDrugs.push(drugData.DrugName);
                console.log(`Added new drug: "${drugData.DrugName}" (MoPHCode: ${code}).`);
            }
        }

        // Step 7: Generate a report
        console.log("Generating report...");
        const report = {
            DrugsAdded: addedDrugs,
            DrugsMarkedAsNotMarketed: notMarketedDrugs,
        };

        const reportPath = path.join(__dirname, "drug_update_report.json");
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`Report exported to ${reportPath}`);

    } catch (error) {
        console.error("Error updating drug data:", error);
    } finally {
        if (connection) await connection.end();
        console.log("Database connection closed.");
    }
}

updateDrugData();
