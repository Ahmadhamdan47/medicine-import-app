const fs = require('fs');
const csv = require('csv-parser');
const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'ommal_oummal',
  password: 'dMR2id57dviMJJnc',
  database: 'ommal_medlist',
};

// Path to the CSV file
const csvFilePath = './january.csv';

// Function to update prices
async function updatePrices(csvPath, dbConfig) {
  let connection;
  try {
    // Connect to the database
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to the database.');

    // Read and process the CSV file
    const updates = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          if (row.code && row.public_price) {
            updates.push([row.public_price, row.code]);
          } else {
            console.error('Missing required fields (code, public_price) in row:', row);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`Read ${updates.length} rows from the CSV file.`);

    // Prepare the SQL query for updating the prices
    const query = `
      UPDATE medications
      SET public_price = ?
      WHERE code = ?
    `;

    // Execute updates in a transaction
    try {
      await connection.beginTransaction();

      for (const [public_price, code] of updates) {
        await connection.execute(query, [public_price, code]);
      }

      await connection.commit();
      console.log(`Updated prices for ${updates.length} medicines.`);
    } catch (error) {
      await connection.rollback();
      console.error('Error during database updates:', error);
    }
  } catch (error) {
    console.error('Error connecting to the database or processing the file:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Call the function
updatePrices(csvFilePath, dbConfig);
