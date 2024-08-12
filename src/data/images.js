const { Op } = require('sequelize');
const NewDrug = require('../models/pharmacyDrug'); // Adjust the path as needed

async function updateImagePath() {
    const BATCH_SIZE = 1000; // Define the batch size
    let offset = 0;
    let hasMoreRecords = true;

    try {
        while (hasMoreRecords) {
            const drugs = await NewDrug.findAll({
                offset: offset,
                limit: BATCH_SIZE,
            });

            if (drugs.length > 0) {
                await NewDrug.update(
                    { ImagesPath: 'drug.jpg' },
                    {
                        where: {
                            DrugID: {
                                [Op.in]: drugs.map(drug => drug.DrugID),
                            },
                        },
                    }
                );

                offset += BATCH_SIZE;
            } else {
                hasMoreRecords = false;
            }
        }

        console.log('All records have been updated successfully.');
    } catch (error) {
        console.error('An error occurred while updating the records:', error);
    }
}

updateImagePath();
