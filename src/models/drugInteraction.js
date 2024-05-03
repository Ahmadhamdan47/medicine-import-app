const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Drug = require('./drug');

const DrugInteraction = sequelize.define('DrugInteraction', {
    DrugInteractionID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    DrugID: {
        type: DataTypes.INTEGER,
        references: {
            model: Drug,
            key: 'DrugID'
        }
    },
    Interaction: {
        type: DataTypes.STRING(500)
    }
});

Drug.hasMany(DrugInteraction, { foreignKey: 'DrugID' });
DrugInteraction.belongsTo(Drug, { foreignKey: 'DrugID' });

module.exports = DrugInteraction;