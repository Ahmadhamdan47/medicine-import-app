const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const DrugRegistration = sequelize.define('DrugRegistration', {
  registrationId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },    
  productType: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  responsibleParty: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  responsiblePartyCountry: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  cargoShippingTerms: DataTypes.STRING(255),
  manufacturer: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  manufacturerCountry: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  drugName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  foreignPrice: {
    type: DataTypes.DECIMAL(18, 6),
    allowNull: false,
    validate: {
      isDecimal: true
    }
  },
  foreignPriceUSD: {
    type: DataTypes.DECIMAL(18, 6),
    allowNull: true,
    validate: {
      isDecimal: true
    }
  },
  regularTariff: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  currency: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  GTIN: {
    type: DataTypes.BIGINT,
    allowNull: true,
    validate: {
      isInt: true
    }
  },

  ingredientsAndStrength: DataTypes.TEXT,
  form: DataTypes.STRING(100),
  primaryContainer: DataTypes.STRING(100),
  agent: DataTypes.STRING(255),
  atcCode: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  atcRelatedIngredient: DataTypes.STRING(255),

  productDescription: DataTypes.TEXT,
  primaryContainerPackage: DataTypes.TEXT,
  indication: DataTypes.STRING(500),
  activeInactiveIngredients: DataTypes.STRING(500),
  posology: DataTypes.STRING(500),
  methodOfAdministration: DataTypes.STRING(500),
  contraindications: DataTypes.STRING(500),
  precautionsForUse: DataTypes.STRING(500),
  effectsOnFGN: DataTypes.STRING(500),
  sideEffects: DataTypes.STRING(500),
  toxicity: DataTypes.STRING(500),
  storageConditions: DataTypes.STRING(500),
  shelfLife: DataTypes.STRING(500),

  referencePrices: {
    type: DataTypes.JSON,
    allowNull: true
  },

  douanes: {
    type: DataTypes.DECIMAL(18, 6),
    allowNull: true
  },
  subsidizationLabel: DataTypes.STRING(255),
  subsidizationPercentage: {
    type: DataTypes.DECIMAL(18, 6),
    allowNull: true
  },
  hospitalPrice: {
    type: DataTypes.DECIMAL(18, 6),
    allowNull: true
  },
  publicPrice: {
    type: DataTypes.DECIMAL(18, 6),
    allowNull: true
  },
  stratumCode: DataTypes.STRING(50),
  originalCurrency: DataTypes.STRING(10),
  usdAmount: {
    type: DataTypes.DECIMAL(18, 6),
    allowNull: true
  },
  lbpAmount: {
    type: DataTypes.DECIMAL(18, 6),
    allowNull: true
  },
  stratumDetails: {
    type: DataTypes.JSON,
    allowNull: true
  },

  iedType: DataTypes.STRING(100),
  iedDrugName: DataTypes.STRING(255),
  iedAtcCode: DataTypes.STRING(50),
  iedAtcRelatedIngredient: DataTypes.STRING(255),
  dosageForm: DataTypes.STRING(100),
  dosages: {
    type: DataTypes.JSON,
    allowNull: true
  },
  route: DataTypes.STRING(100),
  presentationContentQuantity: DataTypes.STRING(100),
  presentationContainer: DataTypes.STRING(100),
  presentationContainerQuantity: DataTypes.STRING(100),
  prescriptionCondition: DataTypes.STRING(255),
  substituteDrugs: {
    type: DataTypes.JSON,
    allowNull: true
  },

  registrationNumber: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  mohCode: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      isInt: true
    }
  },
  registrationDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  reviewDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: DataTypes.TEXT,

  documents: {
    type: DataTypes.JSON,
    allowNull: true
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true
  },

  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'in-progress',
    allowNull: false
  },
  lastSavedStep: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'drug_registration',
  timestamps: true,
  indexes: [
    { name: 'idx_drug_name', fields: ['drugName'] },
    { name: 'idx_manufacturer', fields: ['manufacturer'] },
    { name: 'idx_responsible_party', fields: ['responsibleParty'] },
    { name: 'idx_atc_code', fields: ['atcCode'] },
    { name: 'idx_moh_code', fields: ['mohCode'] },
    { name: 'idx_registration_number', fields: ['registrationNumber'] },
    { name: 'idx_status', fields: ['status'] }
  ]
});

module.exports = DrugRegistration;
