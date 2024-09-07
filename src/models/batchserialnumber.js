const { Model, DataTypes } = require('sequelize');
const sequelize = require ('../../config/databasePharmacy');

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
    refrence:{
        model: 'batchlottracking',
        key:'BatchLotId'
    }
  },
  SerialNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  Inspection: {
    type: DataTypes.ENUM('non-inspected', 'rejected', 'inspected'),
    allowNull: true,  // Allow null to indicate the inspection status
    defaultValue: 'non-inspected',
},
}, {
  sequelize,
  modelName: 'BatchSerialNumber',
  tableName: 'batchserialnumber',
});

module.exports = BatchSerialNumber;