const fs = require('fs');
const path = require('path');
const readline = require('readline');
const sequelize = require('../../config/databasePharmacy');
const Manufacturer = require('../models/manufacturer');

async function importManufacturerData(filePath) {
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const manufacturers = [];

    let isFirstLine = true;
    for await (const line of rl) {
        if (isFirstLine) {
            isFirstLine = false;
            continue; // Skip the header line
        }
        const [ID, ManufacturerName, Country] = line.split('\t');
        manufacturers.push({
            ManufacturerId: parseInt(ID, 10),
            ManufacturerName,
            Country
        });
    }

    try {
        await sequelize.sync();
        await Manufacturer.bulkCreate(manufacturers, { updateOnDuplicate: ['ManufacturerName', 'Country'] });
        console.log('Data successfully imported to Manufacturer table');
    } catch (error) {
        console.error('Error importing data:', error);
    } finally {
        await sequelize.close();
    }
}

const filePath = path.join(__dirname, '../data/manufacturer.tsv');
importManufacturerData(filePath);