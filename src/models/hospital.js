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
  region: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  municipality: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  town: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cellular: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  whatsapp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contactPerson: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contactNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'hospital',
});

module.exports = Hospital;