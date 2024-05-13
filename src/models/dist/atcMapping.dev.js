"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _require = require('sequelize'),
    Model = _require.Model,
    DataTypes = _require.DataTypes;

var sequelize = require('../../config/databasePharmacy');

var Drug = require('./drug');

var ATC_Code = require('./atc');

var drug_atc_mapping =
/*#__PURE__*/
function (_Model) {
  _inherits(drug_atc_mapping, _Model);

  function drug_atc_mapping() {
    _classCallCheck(this, drug_atc_mapping);

    return _possibleConstructorReturn(this, _getPrototypeOf(drug_atc_mapping).apply(this, arguments));
  }

  return drug_atc_mapping;
}(Model);

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
      model: 'drug',
      // name of Target model
      key: 'DrugID' // key in Target model that we're referencing

    },
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION'
  },
  ATC_ID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'atc_code',
      // name of Target model
      key: 'ATC_ID' // key in Target model that we're referencing

    },
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION'
  }
}, {
  sequelize: sequelize,
  modelName: 'drug_atc_mapping',
  tableName: 'drug_atc_mapping',
  timestamps: false
});
drug_atc_mapping.belongsTo(Drug, {
  foreignKey: 'DrugID'
});
drug_atc_mapping.belongsTo(ATC_Code, {
  foreignKey: 'ATC_ID'
});
module.exports = drug_atc_mapping;