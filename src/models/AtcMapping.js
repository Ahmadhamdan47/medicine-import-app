const { Model, DataTypes } = require('sequelize');
const sequelize = require ('../../config/databasePharmacy');
const Drug = require('./pharmacyDrug');
const ATC_Code = require('./atc');
class drug_atc_mapping extends Model {}

drug_atc_mapping.init({
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
  modelName: 'drug_atc_mapping',
  tableName: 'drug_atc_mapping',
  timestamps: false,
});
drug_atc_mapping.belongsTo(Drug, { foreignKey: 'DrugID' });
drug_atc_mapping.belongsTo(ATC_Code, { foreignKey: 'ATC_ID' });
module.exports = drug_atc_mapping;