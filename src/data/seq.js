const fs = require('fs');
const csv = require('csv-parser');
const sequelize = require('../../config/databasePharmacy');
const NewDrug = require('../models/pharmacyDrug');
const { DataTypes, Op } = require('sequelize');

async function addColumns() {
    try {
        const queryInterface = sequelize.getQueryInterface();
        
        const columns = await queryInterface.describeTable('drug');
        
        if (!columns.Seq) {
            await queryInterface.addColumn('drug', 'Seq', {
                type: DataTypes.STRING(255),
                allowNull: true,
            });
        }
        
        if (!columns.PresentationLNDI) {
            await queryInterface.addColumn('drug', 'PresentationLNDI', {
                type: DataTypes.STRING(255),
                allowNull: true,
            });
        }
        
        console.log('Columns Seq and PresentationLNDI checked/added successfully.');
    } catch (error) {
        console.error('Error adding columns:', error);
    }
}

async function updateDrugTable(filePath) {
    const updates = [];
    
    fs.createReadStream(filePath)
        .pipe(csv({ separator: '\t' }))
        .on('data', (row) => {
            const { MoPHCode, Seq, PresentationLNDI } = row;
            if (MoPHCode) {
                updates.push({ MoPHCode, Seq, PresentationLNDI });
            }
        })
        .on('end', async () => {
            console.log(`Processing ${updates.length} records...`);
            for (const update of updates) {
                try {
                    await NewDrug.update(
                        { Seq: update.Seq, PresentationLNDI: update.PresentationLNDI },
                        { where: { MoPHCode: update.MoPHCode }, logging: false }
                    );
                    console.log(`Updated MoPHCode ${update.MoPHCode}`);
                } catch (error) {
                    console.error(`Error updating MoPHCode ${update.MoPHCode}:`, error);
                }
            }
            console.log('Batch update completed.');
        })
        .on('error', (error) => {
            console.error('Error reading file:', error);
        });
}

(async () => {
    await addColumns();
    await updateDrugTable('./seq.tsv');
})();