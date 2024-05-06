// models/pi.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const RFI = require('./rfi');

const PI = sequelize.define('PI', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rfiId: {
        type: DataTypes.INTEGER,
        unique: true,
        references: {
            model: RFI,
            key: 'rfiId'
        }
    },
    invoiceNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    attachedFile: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'pi',
});

module.exports = PI;