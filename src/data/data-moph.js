const fs = require('fs');
const csv = require('csv-parser'); // To parse the TSV file
const { Op } = require('sequelize');
const PharmacyDrug = require('../models/pharmacyDrug')

// File path to your TSV file
const filePath = './2208.tsv'; // Replace with your actual file path

async function checkMoPHCodes() {
    // Array to store file data
    const fileData = [];

    // Read and parse the TSV file
    fs.createReadStream(filePath)
        .pipe(csv({ separator: '\t' })) // Specify tab as the delimiter
        .on('data', (row) => {
            // Push relevant fields to fileData
            fileData.push({
                MoPHCode: row.MoPHCode,
                DrugName: row.DrugName,
            });
        })
        .on('end', async () => {
            console.log('TSV file successfully read.');
            
            // Extract MoPHCode from the file data
            const moPHCodes = fileData.map((entry) => entry.MoPHCode);

            // Query database for existing MoPHCodes
            const existingDrugs = await PharmacyDrug.findAll({
                where: {
                    MoPHCode: {
                        [Op.in]: moPHCodes,
                    },
                },
                attributes: ['MoPHCode'], // Only fetch MoPHCode for efficiency
            });

            // Extract existing MoPHCodes from the database results
            const existingMoPHCodes = existingDrugs.map((drug) => drug.MoPHCode);

            // Identify drugs from the file that are not in the database
            const notFound = fileData.filter(
                (entry) => !existingMoPHCodes.includes(entry.MoPHCode)
            );

            // Generate and log the report
            console.log(`Total drugs checked: ${fileData.length}`);
            console.log(`Drugs not found in the database: ${notFound.length}`);
            console.log('Drugs not found:', notFound);

            // Optional: Write the report to a file
            fs.writeFileSync(
                './not_found_report.json',
                JSON.stringify(notFound, null, 2),
                'utf8'
            );
            console.log('Report saved to not_found_report.json');
        });
}

// Run the script
checkMoPHCodes().catch((err) => {
    console.error('Error running the script:', err);
});
