// src/data/importResponsibleParty.js
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const sequelize = require('../../config/databasePharmacy');
const ResponsibleParty = require('../models/responsibleParty');

async function importResponsiblePartyData(filePath) {
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const responsibleParties = [];

    let isFirstLine = true;
    for await (const line of rl) {
        if (isFirstLine) {
            isFirstLine = false;
            continue; // Skip the header line
        }
        const [ResponsiblePartyId, ResponsiblePartyName, Country] = line.split('\t');
        responsibleParties.push({
            ResponsiblePartyId: parseInt(ResponsiblePartyId, 10),
            ResponsiblePartyName,
            Country
        });
    }

    try {
        await sequelize.sync();
        await ResponsibleParty.bulkCreate(responsibleParties, { updateOnDuplicate: ['ResponsiblePartyName', 'Country'] });
        console.log('Data successfully imported to ResponsibleParty table');
    } catch (error) {
        console.error('Error importing data:', error);
    } finally {
        await sequelize.close();
    }
}

const filePath = path.join(__dirname, '../data/responsible.tsv');
importResponsiblePartyData(filePath);