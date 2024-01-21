const Sequelize = require('sequelize');

const sequelize = new Sequelize('MedLebDrugs', 'sa', 'Theroadof1', {
  host: 'localhost',
  dialect: 'mssql',
  dialectOptions: {
    instanceName: 'SQLEXPRESS',
  },
  define: {
    timestamps: false,
  },
});

module.exports = sequelize;