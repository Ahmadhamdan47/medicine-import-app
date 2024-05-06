const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Drug = require('./drug');

const SubmittedOrder = sequelize.define('submittedOrder', {
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    drugId: {
        type: DataTypes.UUID, // assuming the Drug model's id is UUID type
        allowNull: false,
        references: {
            model: Drug,
            key: 'id'
        }
    },
    brandName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantityRequested: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    RFI: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    Result: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    PI: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    swift: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    invoice: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    rfd: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    stock: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    tableName: 'submittedorder',
    timestamps: false
});

module.exports = SubmittedOrder;
