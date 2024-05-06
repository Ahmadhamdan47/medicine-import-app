const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const Warehouse = sequelize.define('Warehouse', {
    WarehouseId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    LocationName: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    Address: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    Capacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0
        }
    },
    CurrentInventoryLevel: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0
        }
    }
}, {
    tableName: 'warehouse',
    timestamps: false
});

module.exports = Warehouse;