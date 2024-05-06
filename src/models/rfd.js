const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Shipment = require('./shipment'); // Import the Shipment model

const RFD = sequelize.define('RFD', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rfiId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        unique: true,
        references: {         // This is the foreign key reference
            model: Shipment,  // This is the table name (model) the foreign key refers to
            key: 'rfiId'         // This is the column name in the referenced table
        }
    },
    isReceived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 'false'
    }
}, {
    tableName: 'rfd',
});

module.exports = RFD;