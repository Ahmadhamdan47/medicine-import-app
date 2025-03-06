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
    const addedCodes = [];
    const deletedCodes = [];

    try {
        console.log("Connecting to the database...");
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected to the database.");

        // Step 1: Fetch existing medications
        console.log("Fetching existing medication records...");
        const [existingMeds] = await connection.execute("SELECT * FROM medications");
        console.log("Fetched existing medication records.");

        const existingCodes = new Set(existingMeds.map(med => med.code));

        // Fetch highest existing ID
        console.log("Fetching the highest existing ID from the database...");
        const [result] = await connection.execute("SELECT MAX(id) as maxId FROM medications");
        let newId = result[0].maxId ? result[0].maxId + 1 : 1;

        for (const med of parsedData) {
            const {
                code,
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

            const existingMed = existingMeds.find(m => m.code === code);
            const publicPrice = isNaN(parseFloat(public_price)) ? null : parseFloat(public_price) / 89500;

            try {
                if (existingMed) {
                    if (
                        existingMed.reg_number !== reg_number ||
                        existingMed.brand_name !== brand_name ||
                        existingMed.strength !== strength ||
                        existingMed.presentation !== presentation ||
                        existingMed.form !== form ||
                        existingMed.agent !== agent ||
                        existingMed.manufacturer !== manufacturer ||
                        existingMed.country !== country ||
                        existingMed.public_price !== publicPrice ||
                        existingMed.stratum !== stratum
                    ) {
                        console.log(`Updating medication record: ${code}`);
                        await connection.execute(
                            `UPDATE medications SET reg_number = ?, brand_name = ?, strength = ?, presentation = ?, form = ?, agent = ?, manufacturer = ?, country = ?, public_price = ?, stratum = ? WHERE code = ?`,
                            [
                                reg_number, brand_name, strength, presentation, form, agent, manufacturer, country, publicPrice, stratum, code
                            ]
                        );
                    }
                } else {
                    console.log(`Inserting new medication record: ${code}`);
                    await connection.execute(
                        `INSERT INTO medications (id, code, reg_number, brand_name, strength, presentation, form, agent, manufacturer, country, public_price, stratum) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [newId++, code, reg_number, brand_name, strength, presentation, form, agent, manufacturer, country, publicPrice, stratum]
                    );
                    addedCodes.push(code);
                }
            } catch (error) {
                if (error.code === 'ER_DATA_TOO_LONG') {
                    console.error(`Skipping record due to data too long error: ${code}`);
                } else {
                    throw error;
                }
            }
        }

        console.log("Checking for medications no longer in the file...");
        const fileCodes = new Set(parsedData.map(med => med.code));
        for (const med of existingMeds) {
            if (!fileCodes.has(med.code)) {
                console.log(`Deleting medication: ${med.code}`);
                await connection.execute(
                    `DELETE FROM medications WHERE code = ?`,
                    [med.code]
                );
                deletedCodes.push(med.code);
            }
        }

        // Generate the report
        const report = {
            addedCodes,
            deletedCodes,
        };

        const reportPath = path.join(__dirname, 'medlist_update_report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`Report exported to ${reportPath}`);
    } catch (error) {
        console.error("Error updating medications:", error);
    } finally {
        if (connection) await connection.end();
        console.log("Database connection closed.");
    }
}

console.log("Starting Medlist data processing script...");
updateMedications();