const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const Country = sequelize.define('Country', {
    CountryId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    NameAr: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    Enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    CreatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    UpdatedDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    CreatedBy: {
        type: DataTypes.UUID,
        allowNull: true
    },
    UpdatedBy: {
        type: DataTypes.UUID,
        allowNull: true
    }
}, {
    tableName: 'countries',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = Country;