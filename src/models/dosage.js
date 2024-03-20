const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const Dosage = sequelize.define('Dosage', {
    DosageId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Numerator: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Denominator: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CreatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    UpdatedDate: {
        type: DataTypes.DATE
    },
    NumeratorUnit: {
        type: DataTypes.STRING(50)
    },
    DenominatorUnit: {
        type: DataTypes.STRING(50)
    }
}, {
    tableName: 'Dosage',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = Dosage;