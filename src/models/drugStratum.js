const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Drug = require('./drug');
const StratumType = require('./stratumType');

const DrugStratum = sequelize.define('drugstratum', {
    DrugStratumId: {
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
    StratumTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: StratumType,
            key: 'StratumTypeId'
        }
    },
    CreatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    UpdatedDate: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'drugstratum',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
    , indexes: [
        {
            name: 'idx_drugstratum_drug_id',
            fields: ['DrugId']
        }
    ]
});

module.exports = DrugStratum;