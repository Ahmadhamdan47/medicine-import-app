const fs = require('fs');
const readline = require('readline');
const NewDrug = require('../models/pharmacyDrug'); // Adjust path if needed

const updateATCCodesFromTSV = async () => {
    try {
        const fileStream = fs.createReadStream('./atc.tsv'); // No need for full path since it's in the same directory
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of rl) {
            const [ATC, Code] = line.split('\t');

            // Update the drug table with the corresponding ATC code
            await NewDrug.update(
                { ATC_Code: ATC },
                { where: { MoPHCode: Code } }
            );
        }
        console.log('ATC Codes updated successfully.');
    } catch (error) {
        console.error('Error updating ATC Codes:', error);
    }
};

updateATCCodesFromTSV();
