const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Drug = require('./drug');

const Inventory = sequelize.define('Inventory', {
    InventoryID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    DrugID: {
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
    Location: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    ExpirationDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    }
}, {
    tableName: 'inventory',
    timestamps: false
});

module.exports = Inventory;