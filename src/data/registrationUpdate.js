const fs = require('fs');
const Papa = require('papaparse');
const mysql = require('mysql2');

// Database configuration for ommal_medapiv2
const dbConfig = {
  host: 'localhost', // Replace with your database host
  user: 'ommal_ahmad',      // Replace with your database username
  password: 'fISfGr^8q!_gUPMY',      // Replace with your database password
  database: 'ommal_medapiv2'
};

console.log('Database configuration:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database
});

// Create a connection using mysql2
const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the medapiv2 database:', err);
    process.exit(1);
  }
  console.log('Connected to the medapiv2 database successfully.');
});

console.log('Reading registration file: registration.tsv');

fs.readFile('registration.tsv', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the registration file:', err);
    connection.end();
    return;
  }

  console.log('Registration file read successfully. Data length:', data.length);

  // Parse the TSV file using PapaParse with tab delimiter and skip empty lines.
  const parsed = Papa.parse(data, {
    delimiter: "\t",
    skipEmptyLines: true
  });
  
  console.log('Parsed data from file:', parsed.data);

  // Assuming each row is [MoPHCode, RegistrationNumber]
  const records = parsed.data.map(row => ({
    MoPHCode: row[0],
    RegistrationNumber: row[1]
  }));

  console.log('Extracted registration records:', records);

  if (records.length === 0) {
    console.log('No registration records found. Aborting update.');
    connection.end();
    return;
  }

  // Process each record and update the drug table accordingly.
  let pendingUpdates = records.length;

  records.forEach(record => {
    console.log(`Updating record for MoPHCode: ${record.MoPHCode} with RegistrationNumber: ${record.RegistrationNumber}`);

    const sql = `UPDATE drug SET RegistrationNumber = ? WHERE MoPHCode = ?`;
    const params = [record.RegistrationNumber, record.MoPHCode];

    connection.query(sql, params, (error, results) => {
      if (error) {
        console.error(`Error updating MoPHCode ${record.MoPHCode}:`, error);
      } else {
        console.log(`MoPHCode ${record.MoPHCode}: updated successfully. Affected rows: ${results.affectedRows}`);
      }

      // When all records have been processed, close the connection.
      pendingUpdates--;
      if (pendingUpdates === 0) {
        console.log('All registration records processed. Closing database connection.');
        connection.end((endErr) => {
          if (endErr) {
            console.error('Error closing the database connection:', endErr);
          } else {
            console.log('Database connection closed.');
          }
        });
      }
    });
  });
});
