const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const PI = require('./pi');

const Swift = sequelize.define('Swift', {
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
            model: PI,
            key: 'rfiId'
        }
    },
    swiftNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    bankName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    attachedFile: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'swift',
});

module.exports = Swift;