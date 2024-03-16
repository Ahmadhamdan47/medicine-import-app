const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const PresentationType = sequelize.define('PresentationType', {
    PresentationTypeId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Code: {
        type: DataTypes.STRING(255)
    },
    Name: {
        type: DataTypes.STRING(255)
    },
    CreatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    UpdatedDate: {
        type: DataTypes.DATE
    },
    CreatedBy: {
        type: DataTypes.UUID
    },
    UpdatedBy: {
        type: DataTypes.UUID
    },
    Definition: {
        type: DataTypes.STRING(255)
    }
}, {
    tableName: 'PresentationType',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = PresentationType;