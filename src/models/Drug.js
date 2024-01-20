    // src/models/Drug.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Drug = sequelize.define('Drug', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Add other fields as needed
});

module.exports = Drug;
