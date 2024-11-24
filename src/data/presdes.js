const sequelize = require('../../config/databasePharmacy');
const Drug = require('../models/pharmacyDrug');
const DrugPresentation = require('../models/drugPresentation');

const updateDrugPresentation = async () => {
  try {
    // Fetch all presentations with their associated DrugID and Description
    const presentations = await DrugPresentation.findAll({
      attributes: ['DrugId', 'Description'],
    });

    if (presentations.length === 0) {
      console.log('No presentation records found.');
      return;
    }

    for (const presentation of presentations) {
      const { DrugId, Description } = presentation;

      if (!Description) {
        console.log(`Skipped DrugID ${DrugId} as Description is null or empty.`);
        continue;
      }

      // Update the drug table with the presentation description
      await Drug.update(
        { Presentation: Description },
        { where: { DrugID: DrugId } }
      );

      console.log(`Updated DrugID ${DrugId} with Presentation: ${Description}`);
    }

    console.log('All updates completed.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

// Execute the script
updateDrugPresentation();
