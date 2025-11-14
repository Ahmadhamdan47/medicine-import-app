const fs = require('fs');
const csv = require('csv-parser');
const { Op } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const BatchLotTracking = require('../models/batchlot');
const BatchSerialNumber = require('../models/batchserialnumber'); // Import the BatchSerialNumber model

const deleteNonExistentDrugs = async () => {
  const drugNames = new Set();

  const readCSV = new Promise((resolve, reject) => {
    fs.createReadStream('BatchLot.csv')
      .pipe(csv())
      .on('data', (row) => {
        if (row['Drug Name']) {
          drugNames.add(row['Drug Name']);
          console.log(`Reading: ${row['Drug Name']}`);
        }
      })
      .on('end', resolve)
      .on('error', reject);
  });

  await readCSV;

  console.log(`Checking drugs not in: ${Array.from(drugNames).join(', ')}`);

  // Find the BatchLotId and DrugName of the drugs that are going to be deleted
  const batchLotsToDelete = await BatchLotTracking.findAll({
    where: {
      DrugName: {
        [Op.notIn]: Array.from(drugNames),
      },
    },
    attributes: ['BatchLotId', 'DrugName'], // Fetch the DrugName as well
  });

  const drugNamesToDelete = batchLotsToDelete.map(batchLot => batchLot.DrugName); // Get the DrugName of the batch lots to delete

  console.log(`Drugs to delete: ${drugNamesToDelete.join(', ')}`);

  return drugNamesToDelete; // Return the names of the drugs to delete
};

deleteNonExistentDrugs();