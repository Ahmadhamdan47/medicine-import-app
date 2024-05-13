const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Operation = require('./operation');

const OperationShare = sequelize.define('operationshare', {
  isPrivate: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  Share: {
    type: DataTypes.INTEGER,
  }
}, {
  sequelize,
  tableName: 'operationshare',
});

module.exports = OperationShare;