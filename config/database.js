// config/database.js

const Sequelize = require('sequelize');

const sequelize = new Sequelize('MedLebDrugs', 'dbo', '', {
  host: 'DESKTOP-DH3QQ1J',
  dialect: 'mssql',
  define: {
    timestamps: false,
  },
});

module.exports = sequelize;
