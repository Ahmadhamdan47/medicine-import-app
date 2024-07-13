const fs = require('fs');
const readline = require('readline');
const { sequelize } = require('../../config/databasePharmacy');
const DosageForm = require('../models/dosageForm');
const DosageFormMapping = require('../models/dosageFormMapping');
const Drug = require('../models/drug');

// Function to process the TSV file
const processFormTsv = async (filePath) => {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const [Code, Child] = line.split('\t');

    // Find the DosageFormId for the given Child
    const dosageForm = await DosageForm.findOne({ where: { Child } });
    if (!dosageForm) {
      console.error(`No dosage form found for Child: ${Child}`);
      continue;
    }

    // TODO: Determine the DrugID based on the Code from the TSV
    // This is an example, replace it with the actual logic to find the DrugID
    const DrugID = await findDrugIdByCode(Code);
    if (!DrugID) {
      console.error(`No DrugID found for Code: ${Code}`);
      continue;
    }

    // Insert the mapping into the dosageformmapping table
    await DosageFormMapping.create({
      DosageId: DrugID, // Assuming DosageId is meant to be DrugID here
      DosageFormId: dosageForm.DosageFormId
    });
  }
};

// Example function to find DrugID by Code, replace with actual implementation
async function findDrugIdByCode(Code) {
    const drug = await Drug.findOne({ where: { MoPHCode: Code } });
    return drug ? drug.id : null; // Return the id of the drug if found, otherwise return null
  }

// Call the function with the path to your TSV file
processFormTsv(__dirname + '/Form.tsv');