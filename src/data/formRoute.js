const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { Op } = require('sequelize');
const sequelize = require('../../config/databasePharmacy'); // Your DB config
const NewDrug = require('../models/pharmacyDrug'); // Your Drug model

async function updateDrugsFromFile(filePath) {
    const drugs = await NewDrug.findAll();
    const drugMap = new Map();

    // Create a map for fast lookup
    drugs.forEach(drug => {
        drugMap.set(drug.MoPHCode, drug);
    });

    const updates = [];
    const formRawUpdates = [];

    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line) => {
        const [MoPHCode, Form, Route, DFSequence] = line.trim().split('\t');

        if (MoPHCode === 'MoPHCode') return; // Skip header

        const existingDrug = drugMap.get(MoPHCode);

        if (existingDrug) {
            // If record exists and differs, prepare update
            if (
                existingDrug.Form !== Form ||
                existingDrug.Route !== Route ||
                existingDrug.DFSequence !== DFSequence
            ) {
                updates.push({
                    where: { MoPHCode },
                    data: { Form, Route, DFSequence }
                });
            }
        } else {
            // Handle records without a matching MoPHCode
            const unmatchedDrug = Array.from(drugMap.values()).find(
                drug =>
                    drug.Form === Form &&
                    drug.Route === Route &&
                    drug.DFSequence === DFSequence &&
                    !drug.MoPHCode
            );

            if (unmatchedDrug) {
                formRawUpdates.push({
                    where: { DrugID: unmatchedDrug.DrugID },
                    data: {
                        FormRaw: unmatchedDrug.Form,
                        RouteRaw: unmatchedDrug.Route,
                        Form: null,
                        Route: null
                    }
                });
            }
        }
    });

    rl.on('close', async () => {
        // Perform updates in bulk to optimize database calls
        const transaction = await sequelize.transaction();

        try {
            await Promise.all([
                ...updates.map(u =>
                    NewDrug.update(u.data, { where: u.where, transaction })
                ),
                ...formRawUpdates.map(fu =>
                    NewDrug.update(fu.data, { where: fu.where, transaction })
                )
            ]);

            await transaction.commit();
            console.log(`✅ Data update complete. Updated ${updates.length} records.`);
        } catch (error) {
            await transaction.rollback();
            console.error('❌ Error during update:', error);
        }
    });
}

const filePath = path.join(__dirname, 'RouteAndForm.tsv');
updateDrugsFromFile(filePath).catch(err => console.error('Error updating drugs:', err));
