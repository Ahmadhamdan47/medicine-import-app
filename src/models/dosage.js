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
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Numerator1Unit: {
        type: DataTypes.STRING(50)
    },
    Denominator1: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Denominator1Unit: {
        type: DataTypes.STRING(50)
    },
    Numerator2: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Numerator2Unit: {
        type: DataTypes.STRING(50)
    },
    Denominator2: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Denominator2Unit: {
        type: DataTypes.STRING(50)
    },
    Numerator3: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Numerator3Unit: {
        type: DataTypes.STRING(50)
    },
    Denominator3: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Denominator3Unit: {
        type: DataTypes.STRING(50)
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