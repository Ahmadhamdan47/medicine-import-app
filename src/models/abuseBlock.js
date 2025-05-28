const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const AbuseBlock = sequelize.define('AbuseBlock', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  uuid: { type: DataTypes.STRING, allowNull: false, unique: true },
  until: { type: DataTypes.DATE, allowNull: true },
  increment: { type: DataTypes.INTEGER, allowNull: true },
  flagged: { type: DataTypes.BOOLEAN, defaultValue: false },
  reason: { type: DataTypes.STRING, allowNull: true },
  updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, {
  tableName: 'abuse_blocks',
  timestamps: false
});

module.exports = AbuseBlock;
