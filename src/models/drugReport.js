const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const DrugReport = sequelize.define('DrugReport', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  GTIN: { type: DataTypes.STRING },
  BatchNumber: { type: DataTypes.STRING },
  SerialNumber: { type: DataTypes.STRING },
  ExpiryDate: { type: DataTypes.STRING },
  drugNameByGTIN: { type: DataTypes.STRING },
  userDrugName: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  photo: { type: DataTypes.STRING },
  uuid: { type: DataTypes.UUID },
  username: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },

  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'drugreports',
  timestamps: false
});

module.exports = DrugReport;
