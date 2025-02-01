const fs = require('fs');
const readline = require('readline');
const mysql = require('mysql2/promise'); // Use mysql2 for MySQL database

/**
 * Process the CSV file and update the drug records.
 * @param {string} filePath - Path to the CSV file.
 */
const processDFSequenceCSV = async (filePath) => {
  // Create a connection to the database
  const connection = await mysql.createConnection({
    host: 'localhost', // Replace with your database host
    user: 'ommal_ahmad',      // Replace with your database username
    password: 'fISfGr^8q!_gUPMY',      // Replace with your database password
    database: 'ommal_medapiv2' 
  });

  console.log('Database connection established.');

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity // Handle different line endings (CRLF or LF)
  });

  // Skip the header row
  let isFirstLine = true;

  // Iterate over each line in the CSV file
  for await (const line of rl) {
    if (isFirstLine) {
      isFirstLine = false; // Skip the header row
      continue;
    }

    const [MoPHCode, DFSequence] = line.split(','); // Split the line by comma

    // Skip empty or invalid lines
    if (!MoPHCode || !DFSequence) {
      console.error(`Skipping invalid line: ${line}`);
      continue;
    }

    try {
      // Prepare the SQL query to update the drug record
      const query = `
        UPDATE drug
        SET DFSequence = ?
        WHERE MoPHCode = ?
      `;

      // Execute the query
      const [result] = await connection.execute(query, [DFSequence.trim(), MoPHCode.trim()]);

      // Check if the update was successful
      if (result.affectedRows === 0) {
        console.error(`No drug found for MoPHCode: ${MoPHCode}, unable to update.`);
      } else {
        console.log(`Updated drug with MoPHCode: ${MoPHCode}`);
      }
    } catch (error) {
      console.error(`Error updating drug with MoPHCode: ${MoPHCode}`, error);
    }
  }

  // Close the database connection after processing
  await connection.end();
  console.log('Database connection closed.');
};

// Call the function with the path to your CSV file
const csvFilePath = __dirname + '/DFSeq.csv'; // Adjust the path to your CSV file
processDFSequenceCSV(csvFilePath);