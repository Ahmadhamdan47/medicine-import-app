// src/models/manufacturer.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const Manufacturer = sequelize.define('Manufacturer', {
    ManufacturerId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ManufacturerName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Country: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    ParentCompany: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    ParentGroup: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
}, {
    tableName: 'manufacturer',
    timestamps: false
});

module.exports = Manufacturer;