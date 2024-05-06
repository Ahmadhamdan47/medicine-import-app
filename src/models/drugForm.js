const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Drug = require('./drug');
const Form = require('./Form');

const DrugForm = sequelize.define('DrugForm', {
    DrugFormId: {
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
    FormId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Form,
            key: 'FormId'
        }
    }
}, {
    tableName: 'drugform',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = DrugForm;