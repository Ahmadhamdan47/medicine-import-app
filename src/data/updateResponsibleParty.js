// src/data/updateResponsibleParty.js
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const sequelize = require('../../config/databasePharmacy');
const NewDrug = require('../models/pharmacyDrug');

async function updateResponsiblePartyData(filePath) {
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let isFirstLine = true;
    for await (const line of rl) {
        if (isFirstLine) {
            isFirstLine = false;
            continue; // Skip the header line
        }
        const [MoPHCode, RegistrationNumber, ResponsibleParty, ResponsiblePartyCountry, CargoShippingTerms] = line.split('\t');

        try {
            const drug = await NewDrug.findOne({ where: { MoPHCode } });
            if (drug) {
                await drug.update({
                    RegistrationNumber: RegistrationNumber || null,
                    ResponsibleParty: ResponsibleParty || null,
                    ResponsiblePartyCountry: ResponsiblePartyCountry || null,
                    CargoShippingTerms: CargoShippingTerms || null
                });
                console.log(`Drug with MoPHCode ${MoPHCode} has been updated.`);
            } else {
                console.log(`Drug with MoPHCode ${MoPHCode} not found`);
            }
        } catch (error) {
            console.error(`Error updating drug with MoPHCode ${MoPHCode}:`, error);
        }
    }

    try {
        await sequelize.close();
        console.log('Database connection closed.');
    } catch (error) {
        console.error('Error closing the database connection:', error);
    }
}

const filePath = path.join(__dirname, 'editdb.tsv');
updateResponsiblePartyData(filePath);