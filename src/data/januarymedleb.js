const fs = require('fs');
const csv = require('csv-parser');
const NewDrug = require('../models/pharmacyDrug'); // Adjust the path to your model

// Path to the CSV file
const csvFilePath = './january.csv';

// Function to update prices in the drugs table
async function updatePricesFromCSV(csvPath) {
  try {
    // Read and process the CSV file
    const updates = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          if (row.code && row.public_price) {
            updates.push({
              code: row.code,
              public_price: parseFloat(row.public_price), // Ensure public_price is converted to a float
            });
          } else {
            console.error('Missing required fields (code, public_price) in row:', row);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`Read ${updates.length} rows from the CSV file.`);

    // Update prices in the database
    const updatePromises = updates.map(async (entry) => {
      const { code, public_price } = entry;
      try {
        // Find the drug by its Code and update PublicPrice
        const result = await NewDrug.update(
          { PublicPrice: public_price },
          { where: { MoPHCode: code } } // Assuming `MoPHCode` maps to the `code` column in the CSV
        );
        if (result[0] === 0) {
          console.warn(`No record found for code: ${code}`);
        }
      } catch (error) {
        console.error(`Error updating record for code: ${code}`, error);
      }
    });

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    console.log('All updates completed successfully.');
  } catch (error) {
    console.error('Error processing the file or updating the database:', error);
  }
}

// Call the function
updatePricesFromCSV(csvFilePath);
