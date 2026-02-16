const sequelize = require('../config/databasePharmacy');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

async function createTables() {
  try {
    // Create routeoptions table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS routeoptions (
        RouteOptionId INT PRIMARY KEY AUTO_INCREMENT,
        Acronym VARCHAR(50),
        Route VARCHAR(200),
        Category VARCHAR(100),
        SoloMultiple VARCHAR(50),
        MultipleOption TEXT,
        CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        UpdatedDate DATETIME,
        CreatedBy INT,
        UpdatedBy INT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ routeoptions table created successfully');

    // Create dosageoptions table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS dosageoptions (
        DosageOptionId INT PRIMARY KEY AUTO_INCREMENT,
        DosageFormClean VARCHAR(500),
        PhysicalState VARCHAR(100),
        SubstitutionRelationship VARCHAR(200),
        CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        UpdatedDate DATETIME,
        CreatedBy INT,
        UpdatedBy INT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ dosageoptions table created successfully');

  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

async function populateRouteOptions() {
  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(__dirname, '../src/data/routeOptions.csv');
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Skip header rows and empty rows
        if (data.Acronym && data.Acronym !== 'Acronym' && data.Acronym.trim()) {
          results.push({
            Acronym: data.Acronym ? data.Acronym.trim() : null,
            Route: data.Route ? data.Route.trim() : null,
            Category: data.Catgeory ? data.Catgeory.trim() : null, // Note: typo in CSV header
            SoloMultiple: data['Solo / Multiple'] ? data['Solo / Multiple'].trim() : null,
            MultipleOption: data['Multiple option'] ? data['Multiple option'].trim() : null
          });
        }
      })
      .on('end', async () => {
        try {
          console.log(`Parsed ${results.length} route options from CSV`);
          
          // Insert data in batches
          for (const row of results) {
            await sequelize.query(`
              INSERT INTO routeoptions (Acronym, Route, Category, SoloMultiple, MultipleOption)
              VALUES (?, ?, ?, ?, ?)
            `, {
              replacements: [
                row.Acronym,
                row.Route,
                row.Category,
                row.SoloMultiple,
                row.MultipleOption
              ]
            });
          }
          
          console.log(`✓ Inserted ${results.length} route options successfully`);
          resolve();
        } catch (error) {
          console.error('Error inserting route options:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('Error reading route options CSV:', error);
        reject(error);
      });
  });
}

async function populateDosageOptions() {
  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(__dirname, '../src/data/dosageOptions.csv');
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Skip header rows and empty rows
        if (data['Dosage-form Clean'] && data['Dosage-form Clean'] !== 'Dosage-form Clean' && data['Dosage-form Clean'].trim()) {
          results.push({
            DosageFormClean: data['Dosage-form Clean'] ? data['Dosage-form Clean'].trim() : null,
            PhysicalState: data['Physical State'] ? data['Physical State'].trim() : null,
            SubstitutionRelationship: data['Substitution Relationship'] ? data['Substitution Relationship'].trim() : null
          });
        }
      })
      .on('end', async () => {
        try {
          console.log(`Parsed ${results.length} dosage options from CSV`);
          
          // Insert data in batches
          for (const row of results) {
            await sequelize.query(`
              INSERT INTO dosageoptions (DosageFormClean, PhysicalState, SubstitutionRelationship)
              VALUES (?, ?, ?)
            `, {
              replacements: [
                row.DosageFormClean,
                row.PhysicalState,
                row.SubstitutionRelationship
              ]
            });
          }
          
          console.log(`✓ Inserted ${results.length} dosage options successfully`);
          resolve();
        } catch (error) {
          console.error('Error inserting dosage options:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('Error reading dosage options CSV:', error);
        reject(error);
      });
  });
}

async function main() {
  try {
    console.log('Starting table creation and data population...\n');
    
    // Create tables
    await createTables();
    console.log();
    
    // Populate tables
    await populateRouteOptions();
    await populateDosageOptions();
    
    console.log('\n✓ All operations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Error:', error);
    process.exit(1);
  }
}

// Run the script
main();
