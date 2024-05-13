const { Model, DataTypes } = require('sequelize');
const sequelize = require ('../../config/databasePharmacy');
const Drug = require('./drug');
const ATC_Code = require('./ATC');
class Drug_ATC_Mapping extends Model {}

Drug_ATC_Mapping.init({
  MappingID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  DrugID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'drug', // name of Target model
      key: 'DrugID', // key in Target model that we're referencing
    },
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
  },
  ATC_ID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'atc_code', // name of Target model
      key: 'ATC_ID', // key in Target model that we're referencing
    },
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
  }
}, {
  sequelize,
  modelName: 'Drug_ATC_Mapping',
  tableName: 'drug_atc_mapping',
  timestamps: false,
});
Drug_ATC_Mapping.belongsTo(Drug, { foreignKey: 'DrugID' });
Drug_ATC_Mapping.belongsTo(ATC_Code, { foreignKey: 'ATC_ID' });
module.exports = Drug_ATC_Mapping;