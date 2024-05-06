const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const Recipient = sequelize.define('Recipient', {
    RecipientId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    RecipientName: {
        type: DataTypes.STRING(255)
    },
    RecipientType: {
        type: DataTypes.STRING(50)
    },
    Address: {
        type: DataTypes.STRING(255)
    },
    City: {
        type: DataTypes.STRING(100)
    },
    Country: {
        type: DataTypes.STRING(100)
    },
    ContactPerson: {
        type: DataTypes.STRING(255)
    },
    ContactNumber: {
        type: DataTypes.STRING(20)
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
    tableName: 'recipient',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = Recipient;