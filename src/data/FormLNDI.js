const fs = require('fs');
const readline = require('readline');
const { Sequelize, Op } = require('sequelize');
const NewDrug = require('../models/pharmacyDrug'); // Adjust the path as necessary
const sequelize = require('../../config/databasePharmacy');
// Update your database configuration here


const tsvFilePath = './FormLNDI.tsv'; // Path to the FormLNDI TSV file

async function updateFormLNDIData() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    const fileStream = fs.createReadStream(tsvFilePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    // Skip the header line
    let isFirstLine = true;

    for await (const line of rl) {
      if (isFirstLine) {
        isFirstLine = false;
        continue;
      }

      const [Code, FormLNDI] = line.split('\t');
      const trimmedCode = Code.trim();
      const trimmedFormLNDI = FormLNDI.trim();

      console.log(`Processing Code: ${trimmedCode}, FormLNDI: ${trimmedFormLNDI}`);

      const [updatedRowsCount] = await NewDrug.update(
        {
          FormLNDI: trimmedFormLNDI,
        },
        {
          where: {
            MoPHCode: trimmedCode,
          },
        }
      );

      if (updatedRowsCount > 0) {
        console.log(`Updated ${updatedRowsCount} row(s) for MoPHCode: ${trimmedCode}`);
      } else {
        console.log(`No rows updated for MoPHCode: ${trimmedCode}`);
      }
    }

    console.log('Update completed.');
  } catch (error) {
    console.error('Error occurred while updating drug data:', error);
  } finally {
    await sequelize.close();
    console.log('Connection closed.');
  }
}

updateFormLNDIData().catch(error => {
  console.error('Error updating drug data:', error);
});
