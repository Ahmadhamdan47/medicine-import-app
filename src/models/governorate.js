const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const Governorate = sequelize.define('Governorate', {
    GovernorateId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    CountryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Country',
            key: 'CountryId',
        }
    },
    Name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    NameAr: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    Enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
    tableName: 'governorates',
    timestamps: false
});

module.exports = Governorate;