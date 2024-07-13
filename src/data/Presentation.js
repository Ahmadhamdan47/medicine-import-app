const fs = require('fs');
const readline = require('readline');
const { sequelize } = require('../../config/databasePharmacy');
const Drug = require('../models/drug'); // Adjusted to the correct model file name

const processPresTsv = async (filePath) => {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const [Code, Presentation, Form, Dosage, Amount, Route, Agent, Manufacturer, Country] = line.split('\t');

    // Find the Drug by MoPHCode and update it
    const result = await Drug.update({
      Presentation,
      Form,
      Dosage,
      Amount,
      Route,
      Agent,
      Manufacturer,
      Country
    }, {
      where: { MoPHCode: Code }
    });

    if (result[0] === 0) { // If no rows were updated, it means the drug was not found
      console.error(`No drug found for MoPHCode: ${Code}, unable to update.`);
    }
  }
};

// Call the function with the path to your TSV file
processPresTsv(__dirname + '/Pres.tsv');