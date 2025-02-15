const { Op } = require('sequelize');
const NewDrug = require('../models/pharmacyDrug'); // Adjust the path as needed

async function updateImagePath() {
    const BATCH_SIZE = 5000; // Adjust batch size based on DB performance
    let offset = 0;
    let hasMoreRecords = true;

    try {
        console.log('Starting batch update for ImagesPath...');

        while (hasMoreRecords) {
            // Fetch a batch of records
            const drugs = await NewDrug.findAll({
                attributes: ['DrugID'], // Fetch only IDs to reduce memory usage
                offset: offset,
                limit: BATCH_SIZE,
            });

            if (drugs.length > 0) {
                // Update only the selected batch
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

                console.log(`Updated ${drugs.length} records from offset ${offset}`);

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
