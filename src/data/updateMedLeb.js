const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const { parse } = require('papaparse');

// Database configuration
const dbConfig = {
    host: "localhost",       // Replace with your database host
    user: "ommal_ahmad",     // Replace with your database user
    password: "fISfGr^8q!_gUPMY", // Replace with your database password
    database: "ommal_medapiv2",  // Replace with your database name
};

const db = mysql.createConnection(dbConfig);
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
    console.log("Connected to the database");
});

// Path to the TSV file
const filePath = path.join(__dirname, 'marchmedleb.tsv');

// Read and parse the TSV file
console.log("Reading TSV file...");
const fileContent = fs.readFileSync(filePath, 'utf8');
const parsedData = parse(fileContent, {
  header: true,
  delimiter: '\t',
}).data;
console.log("TSV file parsed successfully");

async function processMedlebData() {
  console.log("Processing Medleb data...");
  const addedMoPHCodes = [];
  const notMarketedFalse = [];

  try {
    console.log("Fetching existing drug records from the database...");
    const existingDrugs = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM drug", (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
    console.log("Fetched existing drug records");

    const existingDrugsMap = new Map(existingDrugs.map(drug => [String(drug.MoPHCode).trim(), drug]));

    for (const drugData of parsedData) {
      const MoPHCode = String(drugData.MoPHCode).trim();
      const existingDrug = existingDrugsMap.get(MoPHCode);

      const {
        RegistrationNumber,
        DrugName,
        Presentation,
        Form,
        Agent,
        Manufacturer,
        Country,
        PublicPrice,
        Stratum,
      } = drugData;

      const publicPrice = isNaN(parseFloat(PublicPrice)) ? null : parseFloat(PublicPrice) / 89500;

      try {
        if (existingDrug) {
          if (
            existingDrug.RegistrationNumber !== RegistrationNumber.trim() ||
            existingDrug.DrugName !== DrugName.trim() ||
            existingDrug.Presentation !== Presentation.trim() ||
            existingDrug.Form !== (Form ? Form.trim() : null) ||
            existingDrug.Agent !== Agent.trim() ||
            existingDrug.Manufacturer !== Manufacturer.trim() ||
            existingDrug.Country !== Country.trim() ||
            existingDrug.PublicPrice !== publicPrice ||
            existingDrug.Stratum !== (Stratum ? Stratum.trim() : null)
          ) {
            console.log(`Updating drug record: ${MoPHCode}`);
            await new Promise((resolve, reject) => {
              db.query(
                `UPDATE drug SET RegistrationNumber = ?, DrugName = ?, Presentation = ?, Form = ?, Agent = ?, Manufacturer = ?, Country = ?, PublicPrice = ?, Stratum = ?, NotMarketed = 0 WHERE MoPHCode = ?`,
                [
                  RegistrationNumber.trim(), DrugName.trim(), Presentation.trim(),
                  Form ? Form.trim() : null, Agent.trim(), Manufacturer.trim(),
                  Country.trim(), publicPrice, Stratum ? Stratum.trim() : null, MoPHCode
                ],
                (err) => (err ? reject(err) : resolve())
              );
            });
            notMarketedFalse.push(MoPHCode);
          } else if (existingDrug.NotMarketed) {
            console.log(`Updating NotMarketed flag to false for drug: ${MoPHCode}`);
            await new Promise((resolve, reject) => {
              db.query(
                `UPDATE drug SET NotMarketed = 0 WHERE MoPHCode = ?`,
                [MoPHCode],
                (err) => (err ? reject(err) : resolve())
              );
            });
            notMarketedFalse.push(MoPHCode);
          }
        } 
      } catch (error) {
        if (error.code === 'ER_DATA_TOO_LONG') {
          console.error(`Skipping record due to data too long error: ${MoPHCode}`);
        } else {
          throw error;
        }
      }
    }

    console.log(`Total records updated: ${notMarketedFalse.length}`);
    console.log(`Total new records inserted: ${addedMoPHCodes.length}`);
  } catch (error) {
    console.error('Error processing medleb data:', error);
  } finally {
    console.log("Closing database connection");
    db.end();
  }
}

// Run the script
console.log("Starting Medleb data processing script...");
processMedlebData();
