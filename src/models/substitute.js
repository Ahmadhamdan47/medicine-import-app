const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Drug = require('./drug');

const Substitute = sequelize.define('substitute', {
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
    timestamps: false,
    indexes: [
        {
            name: 'idx_substitute_drug',
            fields: ['Drug']
        },
        {
            name: 'idx_substitute_sub',
            fields: ['Substitute']
        }
    ]
});
// Add these indexes to your Substitute model


module.exports = Substitute;