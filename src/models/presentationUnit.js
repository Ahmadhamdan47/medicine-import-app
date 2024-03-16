const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const PresentationUnit = sequelize.define('PresentationUnit', {
    PresentationUnitId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
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
    }
}, {
    tableName: 'PresentationUnit',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = PresentationUnit;