const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const ContainerType = sequelize.define('ContainerType', {
    ContainerTypeId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    TypeName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    TypeNameAr: {
        type: DataTypes.STRING(100)
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
        type: DataTypes.INTEGER
    },
    UpdatedBy: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'containerType',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = ContainerType;