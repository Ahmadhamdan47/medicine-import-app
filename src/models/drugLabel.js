const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Drug = require('./drug');

const DrugLabel = sequelize.define('DrugLabel', {
    LabelId: {
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
    Code: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    Description: {
        type: DataTypes.STRING(500)
    },
    SubsidyValue: {
        type: DataTypes.DECIMAL(18, 3),
        allowNull: false
    },
    IsSpecialFormula: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    FormulaOperator: {
        type: DataTypes.STRING(5)
    },
    FormulaValue: {
        type: DataTypes.DECIMAL(18, 3)
    },
    Enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    CreatedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    UpdatedDate: {
        type: DataTypes.DATE
    },
    CreatedBy: {
        type: DataTypes.UUID
    },
    UpdatedBy: {
        type: DataTypes.UUID
    }
}, {
    tableName: 'druglabel',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = DrugLabel;