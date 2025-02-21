const fs = require('fs');
const mysql = require('mysql');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'ommal_oummal',
  password: 'dMR2id57dviMJJnc',
  database: 'ommal_medlist',
};

console.log('Database configuration:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database
});

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
  console.log("Connected to the database successfully.");
});

console.log('Reading TSV file: mark.tsv');
fs.readFile('mark2.tsv', 'utf8', (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    connection.end();
    return;
  }

  console.log("File content read successfully. Data length:", data.length);

  // Split file into lines and filter out any empty lines.
  const lines = data.split('\n').map(line => line.trim()).filter(line => line !== '');
  console.log("Parsed lines from file:", lines);

  // Assuming each line is tab-separated and the first column is the code.
  // If your file has a header row, uncomment the next line to skip it:
  // lines.shift();

  const codes = lines.map(line => line.split('\t')[0]);
  console.log("Extracted codes:", codes);

  if (codes.length === 0) {
    console.log("No codes found in the file. Aborting deletion.");
    connection.end();
    return;
  }

  // Build the DELETE query to remove rows with codes NOT in our list.
  const placeholders = codes.map(() => '?').join(',');
  const sql = `DELETE FROM medications WHERE code NOT IN (${placeholders})`;
  console.log("Constructed SQL query:", sql);
  console.log("With parameters:", codes);

  connection.query(sql, codes, (error, results) => {
    if (error) {
      console.error("Error executing deletion query:", error);
    } else {
      console.log(`Deletion query executed successfully. Deleted ${results.affectedRows} rows.`);
    }
    connection.end((err) => {
      if (err) {
        console.error("Error closing the database connection:", err);
      } else {
        console.log("Database connection closed.");
      }
    });
  });
});
