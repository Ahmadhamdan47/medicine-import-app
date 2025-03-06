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
  const notMarketedTrue = [];
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

    const existingMoPHCodes = new Set(existingDrugs.map(drug => drug.MoPHCode));

    for (const drugData of parsedData) {
      const {
        MoPHCode,
        RegistrationNumber,
        DrugName,
        Presentation,
        Form,
        Agent,
        Manufacturer,
        Country,
        PublicPrice,
        NotMarketed,
        Stratum,
      } = drugData;

      const publicPrice = isNaN(parseFloat(PublicPrice)) ? null : parseFloat(PublicPrice) / 89500;
      const existingDrug = existingDrugs.find(drug => drug.MoPHCode === MoPHCode);

      if (existingDrug) {
        if (
          existingDrug.RegistrationNumber !== RegistrationNumber ||
          existingDrug.DrugName !== DrugName ||
          existingDrug.Presentation !== Presentation ||
          existingDrug.Form !== Form ||
          existingDrug.Agent !== Agent ||
          existingDrug.Manufacturer !== Manufacturer ||
          existingDrug.Country !== Country ||
          existingDrug.PublicPrice !== publicPrice ||
          existingDrug.Stratum !== Stratum 
        ) {
          console.log(`Updating drug record: ${MoPHCode}`);
          await new Promise((resolve, reject) => {
            db.query(
              `UPDATE drug SET RegistrationNumber = ?, DrugName = ?, Presentation = ?, Form = ?, Agent = ?, Manufacturer = ?, Country = ?, PublicPrice = ?, Stratum = ?, NotMarketed = 0 WHERE MoPHCode = ?`,
              [
                RegistrationNumber, DrugName, Presentation, Form, Agent, Manufacturer, Country, publicPrice, MoPHCode, Stratum
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
      } else {
        console.log(`Inserting new drug record: ${MoPHCode}`);
        await new Promise((resolve, reject) => {
          db.query(
            `INSERT INTO drug (MoPHCode, RegistrationNumber, DrugName, Presentation, Form, Agent, Manufacturer, Country, PublicPrice, NotMarketed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
            [MoPHCode, RegistrationNumber, DrugName, Presentation, Form, Agent, Manufacturer, Country, publicPrice],
            (err) => (err ? reject(err) : resolve())
          );
        });
        addedMoPHCodes.push(MoPHCode);
      }
    }

    console.log("Checking for drugs no longer in the file...");
    const fileMoPHCodes = new Set(parsedData.map(drug => drug.MoPHCode));
    for (const drug of existingDrugs) {
      if (!fileMoPHCodes.has(drug.MoPHCode)) {
        console.log(`Marking drug as not marketed: ${drug.MoPHCode}`);
        await new Promise((resolve, reject) => {
          db.query(
            `UPDATE drug SET NotMarketed = 1 WHERE MoPHCode = ?`,
            [drug.MoPHCode],
            (err) => (err ? reject(err) : resolve())
          );
        });
        notMarketedTrue.push(drug.MoPHCode);
      }
    }

    // Generate the report
    const report = {
      addedMoPHCodes,
      notMarketedTrue,
      notMarketedFalse,
    };

    const reportPath = path.join(__dirname, 'medleb_update_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`Report exported to ${reportPath}`);
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
