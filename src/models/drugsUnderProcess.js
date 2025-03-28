const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const DrugsUnderProcess = sequelize.define('DrugsUnderProcess', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    // Step 1 - Drug Registry Information
    productType: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    responsibleParty: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    responsiblePartyCountry: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cargoShippingTerms: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    manufacturer: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    manufacturerCountry: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    drugName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    foreignPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    foreignPriceUSD: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    regularTariff: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    publicPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    stratumDetails: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    GTIN: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    // Step 2 - Pharmaceutical Information
    ingredientsAndStrength: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    form: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    primaryContainer: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    agent: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    atcCode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    atcRelatedIngredient: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    // Step 3 - Drug Registry Additional Info
    productDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    primaryContainerPackage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    indication: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    activeInactiveIngredients: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    posology: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    methodOfAdministration: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    contraindications: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    precautionsForUse: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    effectsOnFGN: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    sideEffects: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    toxicity: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    storageConditions: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    shelfLife: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    // Step 4 - Documents and Images
    documents: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    images: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'drugs_under_process',
    timestamps: true,
});

module.exports = DrugsUnderProcess;