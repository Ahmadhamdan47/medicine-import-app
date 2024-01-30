// Import the Sequelize library
const Sequelize = require('sequelize');

// Create a new Sequelize instance and connect to the 'MedLebDrugs' database
// using the username 'sa' and the password 'Theroadof1'
const sequelize = new Sequelize('MedLebDrugs', 'sa', 'Theroadof1', {
  // The host of the database server
  host: 'localhost',
  
  // The dialect/engine of the database
  dialect: 'mssql',
  
  // Additional options for the dialect
  dialectOptions: {
    // The name of the SQL Server instance
    instanceName: 'SQLEXPRESS',
  },
  
  // Global model options
  define: {
    // Disable automatic timestamp fields (createdAt and updatedAt)
    timestamps: false,
  },
});

// Export the Sequelize instance to be used in other parts of the application
module.exports = sequelize;