const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const HospitalOperationMapping = require('./hospitalOperationMapping');
const Hospital = sequelize.define('hospital', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  hospitalName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoryType: {
    type: DataTypes.ENUM,
    values: ['first', 'second', 'third'],
    allowNull: false,
  },
  isPrivate: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'hospital',
});

module.exports = Hospital;