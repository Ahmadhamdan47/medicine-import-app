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
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'BatchSerialNumber',
  tableName: 'batchserialnumber',
});

module.exports = BatchSerialNumber;