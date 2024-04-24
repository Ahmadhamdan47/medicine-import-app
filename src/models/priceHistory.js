const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Drug = require('./Drug');

const PriceHistory = sequelize.define('PriceHistory', {
    PriceHistoryId: {
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
    Price: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true
    },
    EffectiveDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    }
}, {
    tableName: 'PriceHistory',
    timestamps: false
});

module.exports = PriceHistory;