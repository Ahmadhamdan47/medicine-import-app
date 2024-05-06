const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const StratumType = sequelize.define('StratumType', {
    StratumTypeId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Code: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    Description: {
        type: DataTypes.TEXT,
        allowNull: true
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
    tableName: 'stratumtype',
    timestamps: false
});

module.exports = StratumType;