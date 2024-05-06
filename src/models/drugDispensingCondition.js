const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const DrugDispensingConditions = sequelize.define('DrugDispensingConditions', {
    DrugID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'Drug',
            key: 'DrugID'
        }
    },
    DispensingConditionsID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'DispensingConditions',
            key: 'Id'
        }
    }
}, {
    tableName: 'drugdispensingconditions',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = DrugDispensingConditions;