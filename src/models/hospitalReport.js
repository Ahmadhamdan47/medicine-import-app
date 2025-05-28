const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const HospitalReport = sequelize.define('HospitalReport', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  hospitalName: { type: DataTypes.STRING },
  hospitalInfo: { type: DataTypes.TEXT },
  description: { type: DataTypes.TEXT },
  photo: { type: DataTypes.STRING },
  uuid: { type: DataTypes.UUID },
  username: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'hospitalreports',
  timestamps: false
});

module.exports = HospitalReport;
