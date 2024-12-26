const fs = require('fs');
const csv = require('csv-parser');
const { Op } = require('sequelize');
const PharmacyDrug = require('../models/pharmacyDrug'); // Adjust the path to your model

// File path to your TSV file
const filePath = './2208.tsv'; // Replace with your actual file path

async function processAndInsertMissingDrugs() {
    const fileData = [];

    fs.createReadStream(filePath)
        .pipe(csv({ separator: '\t' })) // Specify tab as the delimiter
        .on('data', (row) => {
            fileData.push({
                MophCode: row.MophCode,
                RegistrationNumber: row.RegistrationNumber,
                DrugName: row.DrugName,
                Dosage: row.Dosage,
                Presentation: row.Presentation,
                Form: row.Form,
                Agent: row.Agent,
                Manufacturer: row.Manufacturer,
                Country: row.Country,
            });
        })
        .on('end', async () => {
            console.log('TSV file successfully read.');
            console.log(`Total records in file: ${fileData.length}`);

            try {
                const mophCodes = fileData.map((entry) => entry.MophCode);

                const existingDrugs = await PharmacyDrug.findAll({
                    where: { MoPHCode: { [Op.in]: mophCodes } },
                    attributes: ['MoPHCode'],
                });

                const existingMophCodes = existingDrugs.map((drug) => drug.MoPHCode);

                const missingDrugs = fileData.filter(
                    (entry) => !existingMophCodes.includes(entry.MophCode)
                );

                console.log(`Drugs not found in database: ${missingDrugs.length}`);
                console.log(missingDrugs);

                const drugsToInsert = missingDrugs.map((drug) => ({
                    MoPHCode: drug.MophCode,
                    RegistrationNumber: drug.RegistrationNumber,
                    DrugName: drug.DrugName,
                    Dosage: drug.Dosage || null,
                    Presentation: drug.Presentation || null,
                    Form: drug.Form || null,
                    Agent: drug.Agent || null,
                    Manufacturer: drug.Manufacturer || null,
                    Country: drug.Country || null,
                    NotMarketed: true,
                }));

                console.log(`Drugs prepared for insertion: ${drugsToInsert.length}`);

                if (drugsToInsert.length > 0) {
                    try {
                        const insertedDrugs = await PharmacyDrug.bulkCreate(drugsToInsert, {
                            validate: true,
                        });
                        console.log(`${insertedDrugs.length} drugs successfully added.`);
                    } catch (insertError) {
                        console.error('Error during bulk insertion:', insertError);
                    }
                } else {
                    console.log('No new drugs to insert.');
                }
            } catch (error) {
                console.error('Error occurred during processing:', error);
            }
        });
}

// Run the script
processAndInsertMissingDrugs().catch((err) => {
    console.error('Error running the script:', err);
});
