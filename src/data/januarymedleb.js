const fs = require('fs');
const csv = require('csv-parser');
const mysql = require('mysql2/promise');

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

    // Parse the CSV file and build updates array
    const updates = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          if (row.code && row.public_price) {
            const calculatedPrice = parseFloat(row.public_price) / 89500; // Calculate the new price
            updates.push({ code: row.code, price: calculatedPrice });
          } else {
            console.error('Missing required fields (code, public_price) in row:', row);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`Read ${updates.length} rows from the CSV file.`);

    // Batch process updates using a single SQL query
    const batchSize = 500; // Number of rows per batch
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);

      // Build the SQL query
      let query = `
        UPDATE drug
        SET Price = CASE
      `;
      const codes = [];
      batch.forEach(({ code, price }) => {
        query += `WHEN MoPHCode = ? THEN ? `;
        codes.push(code, price);
      });
      query += `
        END
        WHERE MoPHCode IN (${batch.map(() => '?').join(', ')})
      `;

      // Execute the query
      try {
        await connection.execute(query, [...codes, ...batch.map(({ code }) => code)]);
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
