const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy'); // Adjust path as needed

const StratumConversion = sequelize.define('stratum_conversion', {
    shipping_term: {
        type: DataTypes.STRING(10),
        allowNull: false,
        primaryKey: true
    },
    currency: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true
    },
    rate: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    lbp_equivalent: {
        type: DataTypes.DECIMAL(15, 2)
    },
    e2: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    e1: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    d: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    c: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    b: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    a2: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    a1: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    }
}, {
    tableName: 'stratum_conversion',
    timestamps: false,
    id: false // Disable default "id" column since we use composite PK
});

module.exports = StratumConversion;