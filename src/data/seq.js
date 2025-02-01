const fs = require('fs');
const readline = require('readline');
const mysql = require('mysql2/promise'); // Use mysql2 for MySQL database

/**
 * Process the TSV file and update the drug records.
 * @param {string} filePath - Path to the TSV file.
 */
const processSeqTsv = async (filePath) => {
  // Create a connection to the database
  const connection = await mysql.createConnection({
    host: 'localhost', // Replace with your database host
    user: 'ommal_ahmad',      // Replace with your database username
    password: 'fISfGr^8q!_gUPMY',      // Replace with your database password
    database: 'ommal_medapiv2' // Replace with your database name
  });

  console.log('Database connection established.');

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity // Handle different line endings (CRLF or LF)
  });

  // Iterate over each line in the TSV file
  for await (const line of rl) {
    const [MoPHCode, Seq, PresentationLNDI] = line.split('\t'); // Split the line by tab

    // Skip empty or invalid lines
    if (!MoPHCode || !Seq || !PresentationLNDI) {
      console.error(`Skipping invalid line: ${line}`);
      continue;
    }

    try {
      // Prepare the SQL query to update the drug record
      const query = `
        UPDATE drug
        SET Seq = ?, PresentationLNDI = ?
        WHERE MoPHCode = ?
      `;

      // Execute the query
      const [result] = await connection.execute(query, [Seq.toString(), PresentationLNDI.trim(), MoPHCode.trim()]);

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

// Call the function with the path to your TSV file
const tsvFilePath = __dirname + '/seq.tsv'; // Adjust the path to your TSV file
processSeqTsv(tsvFilePath);