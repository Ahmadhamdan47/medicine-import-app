const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const City = sequelize.define('City', {
    CityId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    DistrictId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'District',
            key: 'DistrictId'
        }
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
    tableName: 'cities',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = City;