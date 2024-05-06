const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Donation = require('./donation');

const BatchLotTracking = sequelize.define('BatchLotTracking', {
    BatchLotId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    donationId:{
        type: DataTypes.INTEGER,
        references: {
            model: 'Donation',
            key: 'DonationId'
        }
    },
    DrugId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Drug',
            key: 'DrugID'
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
    tableName: 'batchlottracking',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = BatchLotTracking;