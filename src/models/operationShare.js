const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Operation = require('./operation');

const OperationShare = sequelize.define('OperationShare', {
  OperationId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Operation,
      key: 'ID',
    }
  },
  Category1: {
    type: DataTypes.DECIMAL(5,2),
  },
  Category2: {
    type: DataTypes.DECIMAL(5,2),
  },
  Category3: {
    type: DataTypes.DECIMAL(5,2),
  },
  isPrivate: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'operationshare',
});

module.exports = OperationShare;