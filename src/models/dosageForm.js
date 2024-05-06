const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const DosageForm = sequelize.define('DosageForm', {
    DosageFormId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Child: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Parent: {
        type: DataTypes.STRING,
        allowNull: true
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
    tableName: 'dosageform',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = DosageForm;