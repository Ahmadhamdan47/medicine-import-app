const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const OTP = sequelize.define('OTP', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = OTP;