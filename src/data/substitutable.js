const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('ommal_medapiv2', 'root', '', {
    host: 'localhost',
    dialect: 'mysql', // or 'postgres', 'sqlite', 'mariadb', 'mssql'
});
// Define the Drug model
const Drug = sequelize.define('drug', {
    DrugID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Substitutable: {
        type: DataTypes.BOOLEAN
    }
}, {
    tableName: 'drug',
    timestamps: false
});

// Define the DrugUpdateLog model
const DrugUpdateLog = sequelize.define('drug_update_log', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    DrugID: {
        type: DataTypes.INTEGER
    },
    old_substitutable: {
        type: DataTypes.BOOLEAN
    },
    new_substitutable: {
        type: DataTypes.BOOLEAN
    },
    update_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'drug_update_log',
    timestamps: false
});

async function updateDrugs() {
    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
        // Find all drugs
        const drugs = await Drug.findAll({ transaction });

        // Iterate over each drug and update
        for (const drug of drugs) {
            const oldSubstitutable = drug.Substitutable;
            const newSubstitutable = true; // or 1, depending on your database setup

            // Update the drug
            await drug.update({ Substitutable: newSubstitutable }, { transaction });

            // Log the update
            await DrugUpdateLog.create({
                DrugID: drug.DrugID,
                old_substitutable: oldSubstitutable,
                new_substitutable: newSubstitutable
            }, { transaction });
        }

        // Commit the transaction
        await transaction.commit();
    } catch (error) {
        // Rollback the transaction in case of error
        await transaction.rollback();
        console.error('Failed to update drugs and log changes:', error);
    }
}

// Run the update function
updateDrugs().then(() => {
    console.log('Drugs updated and logged successfully.');
}).catch(error => {
    console.error('Error updating drugs:', error);
});
