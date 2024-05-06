const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const Hospital = sequelize.define('Hospital', {
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
  modelName: 'Hospital',
  tableName: 'hospital',
});

module.exports = Hospital;