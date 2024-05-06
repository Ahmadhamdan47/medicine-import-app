const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const Donor = sequelize.define('Donor', {
    DonorId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    DonorName: {
        type: DataTypes.STRING(255)
    },
    DonorType: {
        type: DataTypes.ENUM('Organization', 'Individual')
    },
    Address: {
        type: DataTypes.STRING(255)
    },
    PhoneNumber: {
        type: DataTypes.STRING(20)
    },
    Email: {
        type: DataTypes.STRING(100)
    },
    DonorCountry: {
        type: DataTypes.STRING(100)
    },
    IsActive: {
        type: DataTypes.BOOLEAN
    },
    CreatedDate: {
        type: DataTypes.DATE
    },
    UpdatedDate: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'donor',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = Donor;