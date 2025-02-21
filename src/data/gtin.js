const fs = require('fs');
const path = require('path');
const readline = require('readline');
const NewDrug = require('../models/pharmacyDrug'); // Adjust the path as needed

const importGTINs = async () => {
    try {
        const filePath = path.join(__dirname, 'GTIN.tsv');
        const fileStream = fs.createReadStream(filePath);

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        let isFirstLine = true;

        for await (const line of rl) {
            if (isFirstLine) {
                isFirstLine = false;
                continue; // Skip header
            }

            const [MoPHCode, GTIN] = line.split('\t');

            // Skip rows where GTIN is missing, empty, or 'NULL'
            if (!GTIN || GTIN.trim() === '' || GTIN.trim().toUpperCase() === 'NULL') {
                continue;
            }

            // Trim values
            const gtinValue = GTIN.trim();
            const mophCodeValue = MoPHCode.trim();

            await NewDrug.update(
                { GTIN: gtinValue },
                { where: { MoPHCode: mophCodeValue } }
            );
        }

        console.log('GTINs have been successfully imported (NULLs skipped).');
    } catch (error) {
        console.error('Error importing GTINs:', error);
    }
};

// Run the import function
importGTINs();
