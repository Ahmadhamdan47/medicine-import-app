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

// Path to the new TSV file
const filePath = path.join(__dirname, "1712.tsv");

// Read and parse the TSV file
const fileContent = fs.readFileSync(filePath, "utf8");
const parsedData = parse(fileContent, {
    header: true,
    delimiter: "\t",
}).data;

async function processDrugs() {
    let connection;

    try {
        console.log("Connecting to the database...");
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected to the database.");

        // Step 1: Fetch existing drugs
        console.log("Fetching existing drugs from the database...");
        const [existingDrugs] = await connection.execute(
            "SELECT MoPHCode, DrugName, NotMarketed FROM drug"
        );
        const existingMoPHCodes = new Set(existingDrugs.map(drug => drug.MoPHCode));

        // Step 2: Classify drugs
        console.log("Comparing file and database data...");
        const fileMoPHCodes = new Set(parsedData.map(drug => drug.MoPHCode));

        const toAdd = [...fileMoPHCodes].filter(code => !existingMoPHCodes.has(code));
        const toSetNotMarketed = [...existingMoPHCodes].filter(code => !fileMoPHCodes.has(code));

        console.log(`Drugs to add: ${toAdd.length}`);
        console.log(`Drugs to set as NotMarketed: ${toSetNotMarketed.length}`);

        const addedDrugs = [];
        const notMarketedDrugs = [];

        // Step 3: Add new drugs
        for (const code of toAdd) {
            const drugData = parsedData.find(drug => drug.MoPHCode === code);
            if (drugData) {
                await connection.execute(
                    `INSERT INTO drug (
                        MoPHCode, RegistrationNumber, DrugName, Presentation,
                        Form, Agent, Manufacturer, Country, SubsidyPercentage, NotMarketed
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, false)`,
                    [
                        drugData.MoPHCode || null,
                        drugData.RegistrationNumber || null,
                        drugData.DrugName || null,
                        drugData.Presentation || null,
                        drugData.Form || null,
                        drugData.Agent || null,
                        drugData.Manufacturer || null,
                        drugData.Country || null,
                        parseFloat(drugData.SubsidyPercentage) || 0
                    ]
                );
                addedDrugs.push(drugData.DrugName);
                console.log(`Added new drug: "${drugData.DrugName}" (MoPHCode: ${drugData.MoPHCode}).`);
            }
        }

        // Step 4: Update NotMarketed for drugs not in the file
        for (const code of toSetNotMarketed) {
            await connection.execute(
                "UPDATE drug SET NotMarketed = true WHERE MoPHCode = ?",
                [code]
            );
            const drug = existingDrugs.find(d => d.MoPHCode === code);
            if (drug) {
                notMarketedDrugs.push(drug.DrugName);
                console.log(`Set NotMarketed = true for drug: "${drug.DrugName}" (MoPHCode: ${code}).`);
            }
        }

        // Step 5: Generate report
        console.log("Generating report...");
        const report = {
            DrugsAdded: addedDrugs,
            DrugsSetNotMarketed: notMarketedDrugs,
        };

        const reportPath = path.join(__dirname, "drug_update_report_1712.json");
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`Report exported to ${reportPath}`);
    } catch (error) {
        console.error("Error processing drugs:", error);
    } finally {
        if (connection) await connection.end();
        console.log("Database connection closed.");
    }
}

processDrugs();
