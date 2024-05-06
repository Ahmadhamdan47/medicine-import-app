const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Drug = require('./drug');
const Dosage = require('./dosage');

const DrugDosage = sequelize.define('DrugDosage', {
    DrugDosageId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    DrugId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Drug,
            key: 'DrugID'
        }
    },
    DosageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Dosage,
            key: 'DosageId'
        }
    }
}, {
    tableName: 'drugdosage',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = DrugDosage;