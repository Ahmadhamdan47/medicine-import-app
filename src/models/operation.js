const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const CategoryPricing = require('./categoryPricing');
const OperationShare = require('./operationShare');

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
tableName: 'operation',
  
});

Operation.hasMany(CategoryPricing, {
  foreignKey: 'OperationId'
});
Operation.hasMany(OperationShare, {
  foreignKey: 'OperationId'
});
module.exports = Operation;