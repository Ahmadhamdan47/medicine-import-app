const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Operation = require('./operation');
const Hospital = require('./hospital');

const HospitalOperationMapping = sequelize.define('HospitalOperationMapping', {
  OperationId: {
    type: DataTypes.INTEGER,
    references: {
      model: Operation,
      key: 'ID',
    }
  },
  HospitalId: {
    type: DataTypes.INTEGER,
    references: {
      model: Hospital,
      key: 'ID',
    }
  },
}, {
  sequelize,
  modelName: 'HospitalOperationMapping',
tableName: 'hospitaloperationmapping',
});

module.exports = HospitalOperationMapping;