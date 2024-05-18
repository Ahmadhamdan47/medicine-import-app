const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Donation = require('./donation');

const BatchLotTracking = sequelize.define('batchlottracking', {
    BatchLotId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    DonationId:{
        type: DataTypes.INTEGER,
        references: {
            model: 'Donation',
            key: 'DonationId'
        }
    },
    DrugName:{
        type: DataTypes.STRING(255),
    },
    Form:{
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Presentation:{
        type: DataTypes.STRING(255),
        allowNull: false
    },

    GTIN:{
        type: DataTypes.BIGINT(100),
        allowNull: false
    },

    BatchNumber: {
        type: DataTypes.INTEGER(50),
        allowNull: false
    },
    ExpiryDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    Quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Laboratory: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    LaboratoryCountry: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

}, {
    tableName: 'batchlottracking',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = BatchLotTracking;