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

        // Skip the header line if there is one
        let isFirstLine = true;

        for await (const line of rl) {
            if (isFirstLine) {
                isFirstLine = false;
                continue; // skip header
            }

            const [MoPHCode, GTIN] = line.split('\t');

            if (MoPHCode && GTIN) {
                // Update the drug with the matching MoPHCode
                await NewDrug.update(
                    { GTIN },
                    { where: { MoPHCode } }
                );
            }
        }

        console.log('GTINs have been successfully imported.');
    } catch (error) {
        console.error('Error importing GTINs:', error);
    }
};

// Run the import function
importGTINs();