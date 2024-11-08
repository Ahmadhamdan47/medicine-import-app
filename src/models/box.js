const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Donation = require('./donation');

const Box = sequelize.define('Box', {
    BoxId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    DonationId: {
        type: DataTypes.INTEGER,
        allowNull: true,  // Allow null to avoid issues with existing data
        references: {
            model: Donation,
            key: 'DonationId',
        }
    },
    BoxLabel: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    NumberOfPacks: {  // New field for storing the number of packs
        type: DataTypes.INTEGER,
        allowNull: true,  // Allow null to handle existing data without this field
        defaultValue: 0,  // Default to 0 if not specified
    },
    inspected: {
        type: DataTypes.ENUM('inspected', 'not_inspected', 'rejected'),
        defaultValue: 'not_inspected'
      }
}, {
    tableName: 'box',
    timestamps: false,
});

module.exports = Box;
