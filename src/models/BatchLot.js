const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Donation = require('./donation');

const BatchLotTracking = sequelize.define('BatchLotTracking', {
    BatchLotId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    DonationId: {
        type: DataTypes.INTEGER,
        references: {
            model: Donation,
            key: 'DonationId'
        }
    },
    DrugId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Drug',
            key: 'DrugId'
        }
    },
    BatchNumber: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    ProductionDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    ExpiryDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    Quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'BatchLotTracking',
    timestamps: false 
});

BatchLotTracking.belongsTo(Donation, { foreignKey: 'DonationId' });

module.exports = BatchLotTracking;
