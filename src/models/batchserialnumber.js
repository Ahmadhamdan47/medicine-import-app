const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Box = require('./box');  // Import the Box model

class BatchSerialNumber extends Model {}

BatchSerialNumber.init({
  BatchSerialNumberId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  BatchId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
        model: 'batchlottracking',
        key: 'BatchLotId'
    }
  },
  BoxId: {  // Add BoxId field
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Box,  // Link to the Box model
      key: 'BoxId'
    }
  },
  SerialNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  Inspection: {
    type: DataTypes.ENUM('non-inspected', 'rejected', 'inspected'),
    allowNull: true,
    defaultValue: 'non-inspected',
  },
  lastUpdated: {
    type: DataTypes.DATE,
    allowNull: true, // Tracks the last time the status was updated
  }
}, {
  sequelize,
  modelName: 'BatchSerialNumber',
  tableName: 'batchserialnumber',
});

module.exports = BatchSerialNumber;
