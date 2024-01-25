
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const RFI = sequelize.define('RFI', {
    rfiId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    orderId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    drugId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    offerType: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    offerInput: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    notes: {
        type: DataTypes.STRING(250),
        allowNull: true,
    },
    isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    quantityApproved: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'RFI',
    timestamps: false,
});

module.exports = RFI;