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
const filePath = path.join(__dirname, "marchmedlist.tsv");

// Read and parse the TSV file
console.log("Reading TSV file...");
const fileContent = fs.readFileSync(filePath, "utf8");
const parsedData = parse(fileContent, {
    header: true,
    delimiter: "\t",
}).data;
console.log("TSV file parsed successfully");

async function updateMedications() {
    let connection;
    let updatedCount = 0;

    try {
        console.log("Connecting to the database...");
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected to the database.");

        // Step 1: Fetch existing medications
        console.log("Fetching existing medication records...");
        const [existingMeds] = await connection.execute("SELECT * FROM medications");
        console.log("Fetched existing medication records.");

        // Convert database codes to a map for quick lookup
        const existingMedsMap = new Map(existingMeds.map(med => [String(med.code).trim(), med]));

        for (const med of parsedData) {
            const fileCode = String(med.code).trim();
            const existingMed = existingMedsMap.get(fileCode);
            
            if (!existingMed) continue; // Skip if the code doesn't exist in DB

            const {
                reg_number,
                brand_name,
                strength,
                presentation,
                form,
                agent,
                manufacturer,
                country,
                public_price,
                stratum
            } = med;

            const publicPrice = isNaN(parseFloat(public_price)) ? null : parseFloat(public_price) / 89500;

            // Check if any field has changed
            if (
                existingMed.reg_number !== reg_number.trim() ||
                existingMed.brand_name !== brand_name.trim() ||
                existingMed.strength !== strength.trim() ||
                existingMed.presentation !== presentation.trim() ||
                existingMed.form !== (form ? form.trim() : null) ||
                existingMed.agent !== agent.trim() ||
                existingMed.manufacturer !== manufacturer.trim() ||
                existingMed.country !== country.trim() ||
                existingMed.public_price !== publicPrice ||
                existingMed.stratum !== (stratum ? stratum.trim() : null)
            ) {
                console.log(`Updating medication record: ${fileCode}`);
                await connection.execute(
                    `UPDATE medications SET reg_number = ?, brand_name = ?, strength = ?, presentation = ?, form = ?, agent = ?, manufacturer = ?, country = ?, public_price = ?, stratum = ? WHERE code = ?`,
                    [
                        reg_number.trim(), brand_name.trim(), strength.trim(), presentation.trim(),
                        form ? form.trim() : null, agent.trim(), manufacturer.trim(), country.trim(),
                        publicPrice, stratum ? stratum.trim() : null, fileCode
                    ]
                );
                updatedCount++;
            }
        }
        console.log(`Total records updated: ${updatedCount}`);
    } catch (error) {
        console.error("Error updating medications:", error);
    } finally {
        if (connection) await connection.end();
        console.log("Database connection closed.");
    }
}

console.log("Starting Medlist data processing script...");
updateMedications();
