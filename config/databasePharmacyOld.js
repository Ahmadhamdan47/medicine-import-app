const Sequelize = require('sequelize');

const sequelize = new Sequelize('MedLebPharmacyServices', 'sa', 'Theroadof1', {
    // The host of the database server
    host: 'localhost',
    
    // The dialect/engine of the database
    dialect: 'mssql',
    
    // Additional options for the dialect
    dialectOptions: {
      // The name of the SQL Server instance
      instanceName: 'SQLEXPRESS',
    },
    logging: console.log,
    
    // Global model options
    define: {
      // Disable automatic timestamp fields (createdAt and updatedAt)
      timestamps: false,
    },
  });
  
  module.exports = sequelize;