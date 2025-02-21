const fs = require('fs');
const mysql = require('mysql');

// Database configuration for medleb database
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

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the medleb database:', err);
    process.exit(1);
  }
  console.log('Connected to the medleb database successfully.');
});

console.log('Reading registration file: registration.tsv');

fs.readFile('registration.tsv', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the registration file:', err);
    connection.end();
    return;
  }

  console.log('Registration file read successfully. Data length:', data.length);

  // Split the file into lines and remove empty lines.
  const lines = data.split('\n').map(line => line.trim()).filter(line => line !== '');
  console.log('Parsed lines from file:', lines);

  // Assuming each line is tab-separated with at least two columns:
  // Column 0: MoPHCode
  // Column 1: RegistrationNumber
  // If the file has a header row, uncomment the following line:
  // lines.shift();

  const records = lines.map(line => {
    const parts = line.split('\t');
    return {
      MoPHCode: parts[0],
      RegistrationNumber: parts[1]
    };
  });

  console.log('Extracted registration records:', records);

  if (records.length === 0) {
    console.log('No registration records found. Aborting update.');
    connection.end();
    return;
  }

  // Process each record and update the drug table accordingly.
  let pendingUpdates = records.length;

  records.forEach(record => {
    // Log the record to be updated
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
