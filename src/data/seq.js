const fs = require('fs');
const csv = require('csv-parser');
const NewDrug = require('../models/pharmacyDrug');

function updateDrugTable(filePath) {
    console.log('Starting update process...');
    
    fs.createReadStream(filePath)
        .pipe(csv({ separator: '\t' }))
        .on('data', (row) => {
            const { MoPHCode, Seq, PresentationLNDI } = row;
            if (MoPHCode) {
                NewDrug.update(
                    { Seq: Seq, PresentationLNDI: PresentationLNDI },
                    { where: { MoPHCode: MoPHCode }, logging: console.log }
                )
                .then(([affectedRows]) => {
                    if (affectedRows > 0) {
                        console.log(`Successfully updated MoPHCode: ${MoPHCode}`);
                    } else {
                        console.log(`No matching record found for MoPHCode: ${MoPHCode}`);
                    }
                })
                .catch((error) => {
                    console.error(`Error updating MoPHCode ${MoPHCode}:`, error);
                });
            }
        })
        .on('end', () => {
            console.log('Update process completed.');
            process.exit(0);
        })
        .on('error', (error) => {
            console.error('Error reading file:', error);
            process.exit(1);
        });
}

updateDrugTable('./seq.tsv');
