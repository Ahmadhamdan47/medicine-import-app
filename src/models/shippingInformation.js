const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Drug = require('./drug');

const ShippingInformation = sequelize.define('ShippingInformation', {
    ShippingId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    DrugId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Drug,
            key: 'DrugID'
        }
    },
    CarrierName: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    TrackingNumber: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    ShippingDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    DeliveryStatus: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
}, {
    tableName: 'shippinginformation',
    timestamps: false
});

module.exports = ShippingInformation;