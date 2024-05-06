const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const Agent = sequelize.define('Agent', {
    AgentID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    AgentName: {
        type: DataTypes.STRING
    },
    AgentType: {
        type: DataTypes.STRING
    },
    ContactName: {
        type: DataTypes.STRING
    },
    ContactEmail: {
        type: DataTypes.STRING
    },
    ContactPhone: {
        type: DataTypes.STRING
    },
    Address: {
        type: DataTypes.STRING
    },
    City: {
        type: DataTypes.STRING
    },
    Country: {
        type: DataTypes.STRING
    },
    PostalCode: {
        type: DataTypes.STRING
    },
    IsSupplier: {
        type: DataTypes.BOOLEAN
    },
    IsManufacturer: {
        type: DataTypes.BOOLEAN
    },
    IsActive: {
        type: DataTypes.BOOLEAN
    },
    CreatedBy: {
        type: DataTypes.UUID
    },
    CreatedDate: {
        type: DataTypes.DATE
    },
    UpdatedBy: {
        type: DataTypes.UUID
    },
    UpdatedDate: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'agent',
    timestamps: false
});

module.exports = Agent;