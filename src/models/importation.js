const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Drug = require('./Drug');

const Importation = sequelize.define('Importation', {
    ImportationID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    DrugID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Drug,
            key: 'DrugID'
        }
    },
    ImportDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    Quantity: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    Source: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'Importation',
    timestamps: false
});

module.exports = Importation;