const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Dosage = require('./dosage');
const DosageForm = require('./dosageForm');

const DosageFormMapping = sequelize.define('DosageFormMapping', {
    DosageFormMappingId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    DosageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Dosage,
            key: 'DosageId'
        }
    },
    DosageFormId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: DosageForm,
            key: 'DosageFormId'
        }
    }
}, {
    tableName: 'dosageformmapping',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = DosageFormMapping;