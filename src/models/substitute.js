const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Drug = require('./drug');

const Substitute = sequelize.define('Substitute', {
    SubstituteId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Drug: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Drug,
            key: 'DrugID'
        }
    },
    Substitute: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Drug,
            key: 'DrugID'
        }
    }
}, {
    tableName: 'substitute',
    timestamps: false
});

module.exports = Substitute;