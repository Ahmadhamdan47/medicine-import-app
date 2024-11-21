const sequelize = require('../../config/databasePharmacy');
const Drug = require('../models/pharmacyDrug');
const Dosage = require('../models/dosage');

const updateDrugDosage = async () => {
  try {
    // Fetch all dosages with their associated DrugID
    const dosages = await Dosage.findAll({
      attributes: [
        'DrugId',
        'Numerator1', 'Numerator1Unit',
        'Denominator1', 'Denominator1Unit',
        'Numerator2', 'Numerator2Unit',
        'Denominator2', 'Denominator2Unit',
        'Numerator3', 'Numerator3Unit',
        'Denominator3', 'Denominator3Unit',
      ],
    });

    if (dosages.length === 0) {
      console.log('No dosage records found.');
      return;
    }

    for (const dosage of dosages) {
      const { DrugId, ...fields } = dosage.dataValues;

      // Build the dosage string, skipping any fields where the value is 0
      const dosageParts = [];
      for (let i = 1; i <= 3; i++) {
        const numerator = fields[`Numerator${i}`];
        const numeratorUnit = fields[`Numerator${i}Unit`];
        const denominator = fields[`Denominator${i}`];
        const denominatorUnit = fields[`Denominator${i}Unit`];

        if (numerator && numerator !== 0) {
          let part = `${numerator}`;
          if (numeratorUnit) part += ` ${numeratorUnit}`;
          if (denominator && denominator !== 0) {
            part += ` / ${denominator}`;
            if (denominatorUnit) part += ` ${denominatorUnit}`;
          }
          dosageParts.push(part);
        }
      }

      const dosageString = dosageParts.join(' + ');

      // Update the drug table with the generated dosage string
      if (dosageString) {
        await Drug.update(
          { Dosage: dosageString },
          { where: { DrugID: DrugId } }
        );
        console.log(`Updated DrugID ${DrugId} with Dosage: ${dosageString}`);
      } else {
        console.log(`Skipped DrugID ${DrugId} as dosage string is empty.`);
      }
    }

    console.log('All updates completed.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

// Execute the script
updateDrugDosage();
