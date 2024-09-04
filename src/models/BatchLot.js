const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Donation = require('./donation');
const Box = require('./box');  // Import the new Box model

const BatchLotTracking = sequelize.define('batchlottracking', {
    BatchLotId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    DonationId: {
        type: DataTypes.INTEGER,
        allowNull: true,  // Allow null to avoid issues with existing data
        references: {
            model: 'Donation',
            key: 'DonationId'
        }
    },
    BoxId: {
        type: DataTypes.INTEGER,
        allowNull: true,  // Allow null to avoid issues with existing data
        references: {
            model: Box,
            key: 'BoxId',
        }
    },
    DrugName: {
        type: DataTypes.STRING(255),
        allowNull: true  // Allow null to avoid issues with existing data
    },
    Form: {
        type: DataTypes.STRING(255),
        allowNull: true  // Allow null to avoid issues with existing data
    },
    Presentation: {
        type: DataTypes.STRING(255),
        allowNull: true  // Allow null to avoid issues with existing data
    },
    GTIN: {
        type: DataTypes.BIGINT(100),
        allowNull: true  // Allow null to avoid issues with existing data
    },
    BatchNumber: {
        type: DataTypes.STRING(50),  // Changed to STRING for consistency
        allowNull: true  // Allow null to avoid issues with existing data
    },
    ExpiryDate: {
        type: DataTypes.DATE,
        allowNull: true  // Allow null to avoid issues with existing data
    },
    Quantity: {
        type: DataTypes.INTEGER,
        allowNull: true  // Allow null to avoid issues with existing data
    },
    Laboratory: {
        type: DataTypes.STRING(255),
        allowNull: true  // Allow null to avoid issues with existing data
    },
    LaboratoryCountry: {
        type: DataTypes.STRING(255),
        allowNull: true  // Allow null to avoid issues with existing data
    },

}, {
    tableName: 'batchlottracking',
    timestamps: false
});

module.exports = BatchLotTracking;
