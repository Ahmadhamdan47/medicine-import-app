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
    }
}, {
    tableName: 'Box',
    timestamps: false,
});

module.exports = Box;
