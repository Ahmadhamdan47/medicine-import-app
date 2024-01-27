const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const RFD = require('./rfd'); // Import the RFD model

const AgentStock = sequelize.define('AgentStock', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rfiId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {         // This is the foreign key reference
            model: RFD,       // This is the table name (model) the foreign key refers to
            key: 'rfiId'      // This is the column name in the referenced table
        }
    },
    inStock: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'AgentStocks',
});

module.exports = AgentStock;