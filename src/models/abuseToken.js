const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const AbuseToken = sequelize.define('AbuseToken', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  uuid: { type: DataTypes.STRING, allowNull: false },
  service: { type: DataTypes.STRING, allowNull: false },
  hour: { type: DataTypes.INTEGER, allowNull: false },
  count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, {
  tableName: 'abuse_tokens',
  timestamps: false
});

module.exports = AbuseToken;
