const sequelize = require('../../config/databasePharmacy');
const Drug = require('../models/pharmacyDrug');
const ATC_Code = require('../models/atc');

const updateATCRelatedIngredient = async () => {
  const missingATCCodes = []; // To store ATC codes with no match
  let transaction;

  try {
    // Start a transaction for safety
    transaction = await sequelize.transaction();

    // Fetch all drugs with ATCRelatedIngredient as null
    const drugsToUpdate = await Drug.findAll({
      where: { ATCRelatedIngredient: null },
      attributes: ['DrugID', 'ATC_Code'],
    });

    if (drugsToUpdate.length === 0) {
      console.log('No drugs found with ATCRelatedIngredient as null.');
      return;
    }

    for (const drug of drugsToUpdate) {
      const { DrugID, ATC_Code: atcCode } = drug;

      if (!atcCode) {
        console.log(`DrugID ${DrugID} has no ATC_Code, skipping.`);
        continue;
      }

      // Fetch the ATC Name from the atc_code table
      const atcRecord = await ATC_Code.findOne({
        where: { Code: atcCode },
        attributes: ['Name'],
      });

      if (!atcRecord) {
        console.log(`No ATC record found for ATC_Code ${atcCode}, skipping DrugID ${DrugID}.`);
        if (!missingATCCodes.includes(atcCode)) {
          missingATCCodes.push(atcCode); // Add to the missing ATC codes list
        }
        continue;
      }

      const atcName = atcRecord.Name;

      // Update the drug's ATCRelatedIngredient field
      await Drug.update(
        { ATCRelatedIngredient: atcName },
        { where: { DrugID } },
        { transaction }
      );

      console.log(`Updated DrugID ${DrugID} with ATCRelatedIngredient: ${atcName}`);
    }

    // Commit the transaction
    await transaction.commit();
    console.log('All updates completed successfully.');

    if (missingATCCodes.length > 0) {
      console.log('The following ATC codes have no corresponding record in the ATC table:', missingATCCodes);
    } else {
      console.log('All ATC codes have corresponding records in the ATC table.');
    }

    return missingATCCodes; // Return the missing ATC codes
  } catch (error) {
    // Rollback the transaction in case of errors
    if (transaction) await transaction.rollback();
    console.error('An error occurred:', error);
  }
};

// Execute the script
updateATCRelatedIngredient().then((missingATCCodes) => {
  if (missingATCCodes && missingATCCodes.length > 0) {
    console.log('List of missing ATC codes:', missingATCCodes);
  }
});
