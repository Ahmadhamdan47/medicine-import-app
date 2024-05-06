const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const District = sequelize.define('District', {
    DistrictId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    GovernorateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Governorate',
            key: 'GovernorateId'
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
    tableName: 'districts',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = District;@