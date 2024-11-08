const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Operation = require('./operation');
const Hospital = require('./hospital');

const HospitalOperationMapping = sequelize.define('hospitaloperationmapping', {
id:{
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true,
},
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
  tableName: 'hospitaloperationmapping',
});
HospitalOperationMapping.belongsTo(Hospital, { foreignKey: 'HospitalId' });
Hospital.hasMany(HospitalOperationMapping, { foreignKey: 'HospitalId' });

module.exports = HospitalOperationMapping;