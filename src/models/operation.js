const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const Operation = sequelize.define('Operation', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Name: {
    type: DataTypes.STRING,
  },
  Code: {
    type: DataTypes.STRING,
  },
  System: {
    type: DataTypes.STRING,
  },
  Description: {
    type: DataTypes.TEXT,
  },
}, {
  sequelize,
  modelName: 'Operation',
  tableName: 'operation',
});

module.exports = Operation;