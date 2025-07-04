const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const OperationSystems = sequelize.define('operationsystems', {
  systemChar: {
    type: DataTypes.CHAR,
    primaryKey: true,
  },
  systemName: {
    type: DataTypes.STRING,
  },
  NameAR: {
    type: DataTypes.STRING,
  },
    systemIcon: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  tableName: 'operationsystems',
});

module.exports = OperationSystems;