const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Drug = require('./pharmacyDrug');

const Dosage = sequelize.define('Dosage', {
    DosageId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Numerator1: {
        type: DataTypes.DECIMAL(15, 4),
        allowNull: true,
        defaultValue: 0
    },
    Numerator1Unit: {
        type: DataTypes.STRING(50),
        defaultValue: ''
    },
    Denominator1: {
        type: DataTypes.DECIMAL(15, 4),
        allowNull: true,
        defaultValue: 0
    },
    Denominator1Unit: {
        type: DataTypes.STRING(50),
        defaultValue: ''
    },
    Numerator2: {
        type: DataTypes.DECIMAL(15, 4),
        allowNull: true,
        defaultValue: 0
    },
    Numerator2Unit: {
        type: DataTypes.STRING(50),
        defaultValue: ''
    },
    Denominator2: {
        type: DataTypes.DECIMAL(15, 4),
        allowNull: true,
        defaultValue: 0
    },
    Denominator2Unit: {
        type: DataTypes.STRING(50),
        defaultValue: ''
    },
    Numerator3: {
        type: DataTypes.DECIMAL(15, 4),
        allowNull: true,
        defaultValue: 0
    },
    Numerator3Unit: {
        type: DataTypes.STRING(50),
        defaultValue: ''
    },
    Denominator3: {
        type: DataTypes.DECIMAL(15, 4),
        allowNull: true,
        defaultValue: 0
    },
    Denominator3Unit: {
        type: DataTypes.STRING(50),
        defaultValue: ''
    },
    CreatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    UpdatedDate: {
        type: DataTypes.DATE
    },
  
    DrugId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Drug,
            key: 'DrugID'
        }
    }
}, {
    tableName: 'dosage',
    timestamps: false,
    indexes: [
        {
            name: 'idx_dosage_drug_id',
            fields: ['DrugId']
        }
    ]
});
// Add this index to your Dosage model

module.exports = Dosage;