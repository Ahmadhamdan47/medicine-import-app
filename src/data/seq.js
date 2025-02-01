const fs = require('fs');
const readline = require('readline');
const { sequelize } = require('../../config/databasePharmacy'); // Import Sequelize instance
const Drug = require('../models/pharmacyDrug'); // Adjusted to the correct model file name

/**
 * Process the TSV file and update the drug records.
 * @param {string} filePath - Path to the TSV file.
 */
const processSeqTsv = async (filePath) => {
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
      // Update the drug record with the new DFSequence and Presentation values
      const result = await Drug.update(
        {
          DFSequence: Seq.toString(), // Convert Seq to string
          Presentation: PresentationLNDI.trim() // Trim any extra spaces
        },
        {
          where: { MoPHCode: MoPHCode.trim() } // Match the drug by MoPHCode
        }
      );

      // Check if the update was successful
      if (result[0] === 0) {
        console.error(`No drug found for MoPHCode: ${MoPHCode}, unable to update.`);
      } else {
        console.log(`Updated drug with MoPHCode: ${MoPHCode}`);
      }
    } catch (error) {
      console.error(`Error updating drug with MoPHCode: ${MoPHCode}`, error);
    }
  }

  // Close the database connection after processing
  await sequelize.close();
  console.log('Database connection closed.');
};

// Call the function with the path to your TSV file
const tsvFilePath = __dirname + '/seq.tsv'; // Adjust the path to your TSV file
processSeqTsv(tsvFilePath);