const fs = require('fs');
const path = require('path');
const  NewDrug  = require('../models/pharmacyDrug'); // Import the NewDrug model

// Path to the TSV file
const tsvFilePath = path.join(__dirname, 'seq.tsv');

async function updateDrugsFromTSV() {
    try {
        // Step 1: Read and parse the TSV file
        const tsvData = fs.readFileSync(tsvFilePath, 'utf8');
        const rows = tsvData.split('\n').slice(1); // Skip the header row
        const parsedData = rows.map(row => {
            const [MoPHCode, Seq, PresentationLNDI] = row.trim().split('\t');
            return { MoPHCode, Seq: parseInt(Seq, 10), PresentationLNDI };
        });

        // Step 2: Iterate over the parsed data and update the database
        for (const { MoPHCode, Seq, PresentationLNDI } of parsedData) {
            if (!MoPHCode || !Seq || !PresentationLNDI) continue; // Skip invalid rows

            // Find the drug by MoPHCode
            const drug = await NewDrug.findOne({ where: { MoPHCode } });
            if (drug) {
                // Update the drug record with Seq and PresentationLNDI
                await drug.update({
                    DFSequence: Seq.toString(), // Assuming DFSequence corresponds to Seq
                    Presentation: PresentationLNDI // Assuming Presentation corresponds to PresentationLNDI
                });
                console.log(`Updated drug with MoPHCode: ${MoPHCode}`);
            } else {
                console.log(`No drug found with MoPHCode: ${MoPHCode}`);
            }
        }

        console.log('Database update completed.');
    } catch (error) {
        console.error('Error updating drugs:', error);
    } finally {
        // Close the database connection
        await sequelize.close();
    }
}

// Run the script
updateDrugsFromTSV();