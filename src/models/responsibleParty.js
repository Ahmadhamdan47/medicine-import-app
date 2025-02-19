// src/models/responsibleParty.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const ResponsibleParty = sequelize.define('ResponsibleParty', {
    ResponsiblePartyId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ResponsiblePartyName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Country: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'responsibleParty',
    timestamps: false
});

module.exports = ResponsibleParty;