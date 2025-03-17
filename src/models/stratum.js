const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy'); // Adjust path as needed

const stratum = sequelize.define('stratum', {
    stratumCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    priceThreshold: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    shippingCostRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    },
    regularDutyRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    },
    specialDutyRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    },
    agentMargin: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    },
    pharmacyMargin: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    }
}, {
    tableName: 'stratum',
    timestamps: false
});

module.exports = stratum;
