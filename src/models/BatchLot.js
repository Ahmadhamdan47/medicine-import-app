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
        
    },
    Presentation:{
        type: DataTypes.STRING(255),
         
    },

    GTIN:{
        type: DataTypes.BIGINT(100),
         
    },

    BatchNumber: {
        type: DataTypes.INTEGER(50),
         
    },
    ExpiryDate: {
        type: DataTypes.DATE,
         
    },
    Quantity: {
        type: DataTypes.INTEGER,
         
    },
    Laboratory: {
        type: DataTypes.STRING(255),
         
    },
    LaboratoryCountry: {
        type: DataTypes.STRING(255),
         
    },

}, {
    tableName: 'batchlottracking',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = BatchLotTracking;