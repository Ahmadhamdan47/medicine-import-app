// Import the DataTypes object from the 'sequelize' module
const { DataTypes } = require('sequelize');

// Import the sequelize configuration
const sequelize = require('../../config/database');

// Import the RFD model
const RFD = require('./rfd');

// Define a new model named 'AgentStock' using the sequelize.define method
const AgentStock = sequelize.define('AgentStock', {
    // Define an 'id' field of type INTEGER, which is the primary key and auto-increments
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    // Define a 'rfiId' field of type INTEGER, which cannot be null and is a foreign key referencing the 'rfiId' field in the RFD model
    rfiId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {         // This is the foreign key reference
            model: RFD,       // This is the table name (model) the foreign key refers to
            key: 'rfiId'      // This is the column name in the referenced table
        }
    },
    // Define an 'inStock' field of type BOOLEAN, which cannot be null and defaults to false
    inStock: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    // Specify the table name for the model
    tableName: 'agentStocks',
});

// Export the AgentStock model
module.exports = AgentStock;