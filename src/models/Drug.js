// src/models/Drug.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Drug = sequelize.define('Drug', {
  Guid: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  ATCGuid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  ATCName: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },
  DosageGuid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  DosageName: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },
  PresentationGuid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  PresentationName: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },
  FormGuid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  FormName: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },
  RouteGuid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  RouteName: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },
  StratumGuid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  StratumName: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },
  StratumTypeGuid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  StratumTypeName: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },
  AgentGuid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  AgentName: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },
  BrandGuid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  BrandName: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },
  ManufacturerGuid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  ManufacturerName: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },
  CountryGuid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  CountryName: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },
  ResponsiblePartyGuid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  ResponsiblePartyName: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },
  DrugLabelGuid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  DrugLabelName: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },
  Code: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  RegistrationNumber: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  CIF_FOB: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  B_G: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  NM: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  GTIN: {
    type: DataTypes.STRING(255),
  },
  Notes: {
    type: DataTypes.STRING(4000),
  },
  Description: {
    type: DataTypes.STRING(500),
  },
  ActiveInactiveIngredient: {
    type: DataTypes.STRING(500),
  },
  Indication: {
    type: DataTypes.STRING(500),
  },
  Posology: {
    type: DataTypes.STRING(500),
  },
  MethodOfAdministration: {
    type: DataTypes.STRING(500),
  },
  Contraindications: {
    type: DataTypes.STRING(500),
  },
  PrecautionForUse: {
    type: DataTypes.STRING(500),
  },
  EffectOnFGN: {
    type: DataTypes.STRING(500),
  },
  SideEffect: {
    type: DataTypes.STRING(500),
  },
  Toxicity: {
    type: DataTypes.STRING(500),
  },
  StorageCondition: {
    type: DataTypes.STRING(500),
  },
  ShelfLife: {
    type: DataTypes.STRING(500),
  },
  IngredientLabel: {
    type: DataTypes.STRING(500),
  },
  IsBiological: {
    type: DataTypes.BOOLEAN,
  },
  IsNarcotis: {
    type: DataTypes.BOOLEAN,
  },
  IsOTC: {
    type: DataTypes.BOOLEAN,
  },
  IsNSSF: {
    type: DataTypes.BOOLEAN,
  },
  PriceUSD: {
    type: DataTypes.DECIMAL(18, 6),
    allowNull: false,
  },
  PriceLBP: {
    type: DataTypes.DECIMAL(18, 6),
    allowNull: false,
  },
  ImagesPath: {
    type: DataTypes.STRING(500),
  },
  ImageDefault: {
    type: DataTypes.STRING(500),
  },
  InteractionIngredientName: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'Drug_List', // Specify the exact table name from the database
});

module.exports = Drug;
