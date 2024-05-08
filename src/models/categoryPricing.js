const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Operation = require('./operation');


const CategoryPricing = sequelize.define('CategoryPricing', {
  OperationId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Operation,
      key: 'ID',
    }
  },
  CategoryType: {
    type: DataTypes.ENUM,
    values: ['first', 'second', 'third'],
    allowNull: false,
  },
  isPrivate: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  FirstProcedurePrice: {
    type: DataTypes.INTEGER,
  },
  FirstSurgeon: {
    type: DataTypes.INTEGER,
  },
  FirstAnesthist: {
    type: DataTypes.INTEGER,
  },
  FirstConsultant: {
    type: DataTypes.INTEGER,
  },
  SecondProcedurePrice: {
    type: DataTypes.INTEGER,
  },
  SecondSurgeon: {
    type: DataTypes.INTEGER,
  },
  SecondAnesthist: {
    type: DataTypes.INTEGER,
  },
  SecondConsultant: {
    type: DataTypes.INTEGER,
  },
  TotalAmount: {
    type: DataTypes.INTEGER,
  },
}, {
  sequelize,
  tableName: 'categorypricing',
});


module.exports = CategoryPricing;