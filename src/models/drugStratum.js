const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Drug = require('./Drug');
const StratumType = require('./StratumType');

const DrugStratum = sequelize.define('DrugStratum', {
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
    tableName: 'DrugStratum',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = DrugStratum;