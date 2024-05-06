const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const TreatmentType = sequelize.define('TreatmentType', {
    TreatmentTypeId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Code: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    Name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    NameAr: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    Description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    CreatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    UpdatedDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    CreatedBy: {
        type: DataTypes.UUID,
        allowNull: true
    },
    UpdatedBy: {
        type: DataTypes.UUID,
        allowNull: true
    }
}, {
    tableName: 'treatmenttype',
    timestamps: false
});

module.exports = TreatmentType;