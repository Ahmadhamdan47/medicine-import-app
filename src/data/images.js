const { Op } = require('sequelize');
const NewDrug = require('../models/pharmacyDrug'); // Adjust the path as needed

async function updateImagePath() {
    try {
        console.log('Updating ImagesPath for all records...');

        await NewDrug.update(
            { ImagesPath: 'drug.jpg' }, // Set new value
            { where: {} } // This applies the update to all rows
        );

        console.log('All records have been updated successfully.');
    } catch (error) {
        console.error('An error occurred while updating the records:', error);
    }
}

updateImagePath();
