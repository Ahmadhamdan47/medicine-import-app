const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Drug = require('./drug');

const TransactionHistory = sequelize.define('TransactionHistory', {
    TransactionId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    TransactionType: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    TransactionDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    DrugId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Drug,
            key: 'DrugID'
        }
    },
    Quantity: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    TransactionDescription: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'transactionhistory',
    timestamps: false
});

module.exports = TransactionHistory;