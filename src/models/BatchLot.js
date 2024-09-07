const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Donation = require('./donation');

const BatchLotTracking = sequelize.define('batchlottracking', {
  BatchLotId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  DonationId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Donation',
      key: 'DonationId'
    }
  },
  DrugName: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  Form: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  Presentation: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  GTIN: {
    type: DataTypes.BIGINT(100),
    allowNull: true
  },
  BatchNumber: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  ExpiryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  Quantity: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  Laboratory: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  LaboratoryCountry: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
}, {
  tableName: 'batchlottracking',
  timestamps: false
});

module.exports = BatchLotTracking;
