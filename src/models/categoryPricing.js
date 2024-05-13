const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Operation = require('./operation');

const CategoryPricing = sequelize.define('categorypricing', {
  OperationId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Operation,
      key: 'ID',
    }
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
  FirstHospital1: {
    type: DataTypes.INTEGER,
  },
  FirstHospital2: {
    type: DataTypes.INTEGER,
  },
  FirstHospital3: {
    type: DataTypes.INTEGER,
  },
  FirstCategory1: {
    type: DataTypes.INTEGER,
  },
  FirstCategory2: {
    type: DataTypes.INTEGER,
  },
  FirstCategory3: {
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
  SecondHospital1: {
    type: DataTypes.INTEGER,
  },
  SecondHospital2: {
    type: DataTypes.INTEGER,
  },
  SecondHospital3: {
    type: DataTypes.INTEGER,
  },
  SecondCategory1: {
    type: DataTypes.INTEGER,
  },
  SecondCategory2: {
    type: DataTypes.INTEGER,
  },
  SecondCategory3: {
    type: DataTypes.INTEGER,
  }
}, {
  sequelize,
  tableName: 'categorypricing',
});

module.exports = CategoryPricing;