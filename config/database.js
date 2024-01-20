// config/database.js

const Sequelize = require('sequelize');

const sequelize = new Sequelize('Pharmacy', 'sa', 'Therooadof1', {
  host: 'localhost  ',
  dialect: 'mssql',
  define: {
    timestamps: false,
  },
});

module.exports = sequelize;
