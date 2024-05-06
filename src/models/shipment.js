const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Swift = require('./swift');

const Shipment = sequelize.define('Shipment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rfiId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        references: {
            model: Swift,
            key: 'rfiId'
        }
    },
    expectedDateOfArrival: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    borderCrossing: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    invoiceNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    invoiceDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    invoiceAmount: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    invoiceAttachedFile: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    barcode2D: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    gtinNb: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    numberOfLots: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    batchNum: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    prodDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    expDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    snLotNum: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'shipment',
});

module.exports = Shipment;