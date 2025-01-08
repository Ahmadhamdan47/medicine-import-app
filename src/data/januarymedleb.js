const fs = require('fs');
const csv = require('csv-parser');
const mysql = require('mysql2/promise');
const _ = require('lodash');

const dbConfig = {
  host: 'localhost',
  user: 'ommal_ahmad',
  password: 'fISfGr^8q!_gUPMY',
  database: 'ommal_medapiv2',
};

const csvFilePath = './january.csv';

async function updatePricesDirectly(csvPath) {
  let connection;
  try {
    // Connect to the database
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to the database.');

    // Parse the CSV file
    const updates = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          if (row.code && row.public_price) {
            updates.push([parseFloat(row.public_price), row.code]);
          } else {
            console.error('Missing required fields (code, public_price) in row:', row);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`Read ${updates.length} rows from the CSV file.`);

    // Process updates in batches
    const batchSize = 100; // Number of updates per batch
    const updateBatches = _.chunk(updates, batchSize);

    const query = `
      UPDATE drug
      SET PublicPrice = ?
      WHERE MoPHCode = ?
    `;

    for (const batch of updateBatches) {
      const updatePromises = batch.map(([public_price, code]) =>
        connection.execute(query, [public_price, code])
      );

      try {
        await Promise.all(updatePromises);
        console.log(`Batch of ${batch.length} records updated successfully.`);
      } catch (error) {
        console.error('Error updating batch:', error);
      }
    }

    console.log('All updates completed successfully.');
  } catch (error) {
    console.error('Error connecting to the database or processing the file:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Run the function
updatePricesDirectly(csvFilePath);
