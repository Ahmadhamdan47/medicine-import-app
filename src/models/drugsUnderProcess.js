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
    status: {
        type: DataTypes.ENUM('registered', 'refused', 'under process'),
        allowNull: false,
        defaultValue: 'under process'
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
        type: DataTypes.JSON,
        allowNull: true,
    },
    images: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    // New fields for detailed documents:
    registrationRequest: { type: DataTypes.JSON, allowNull: true },
    drugCertificate: { type: DataTypes.JSON, allowNull: true },
    responsiblePartyProfile: { type: DataTypes.JSON, allowNull: true },
    plantProfile: { type: DataTypes.JSON, allowNull: true },
    gmpCertificate: { type: DataTypes.JSON, allowNull: true },
    originStatement: { type: DataTypes.JSON, allowNull: true },
    drugSubsList: { type: DataTypes.JSON, allowNull: true },
    patents: { type: DataTypes.JSON, allowNull: true },
    studyWarranty: { type: DataTypes.JSON, allowNull: true },
    pricingDocuments: { type: DataTypes.JSON, allowNull: true },
    analysisDocuments: { type: DataTypes.JSON, allowNull: true },
    otherDocuments: { type: DataTypes.JSON, allowNull: true },
    // New fields for detailed images:
    frontSide: { type: DataTypes.JSON, allowNull: true },
    backSide: { type: DataTypes.JSON, allowNull: true },
    rightSide: { type: DataTypes.JSON, allowNull: true },
    leftSide: { type: DataTypes.JSON, allowNull: true },
    topSide: { type: DataTypes.JSON, allowNull: true },
    downSide: { type: DataTypes.JSON, allowNull: true },
    main: { type: DataTypes.JSON, allowNull: true },
    content1: { type: DataTypes.JSON, allowNull: true },
    content2: { type: DataTypes.JSON, allowNull: true },
    contentPackage: { type: DataTypes.JSON, allowNull: true },
    // Step 5 - Reference Prices
    referencePrices: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    // Step 6 - Pricing Information
    pricingInfo: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    priceThreshold: { type: DataTypes.DECIMAL, allowNull: true },
    shippingCostRate: { type: DataTypes.DECIMAL, allowNull: true },
    regularDutyRate: { type: DataTypes.DECIMAL, allowNull: true },
    specialDutyRate: { type: DataTypes.DECIMAL, allowNull: true },
    agentMargin: { type: DataTypes.DECIMAL, allowNull: true },
    pharmacyMargin: { type: DataTypes.DECIMAL, allowNull: true },
    stratumCode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    originalCurrency: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    usdAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    lbpAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    // Step 7 - Unified Drug Information
    unifiedDrugInfo: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    iedType: { type: DataTypes.JSON, allowNull: true },
    iedDrugName: { type: DataTypes.JSON, allowNull: true },
    iedAtcCode: { type: DataTypes.JSON, allowNull: true },
    iedAtcRelatedIngredient: { type: DataTypes.JSON, allowNull: true },
    dosageForm: { type: DataTypes.JSON, allowNull: true },
    dosages: { type: DataTypes.JSON, allowNull: true },
    numerator: { type: DataTypes.JSON, allowNull: true },
    numeratorUnit: { type: DataTypes.JSON, allowNull: true },
    denominator: { type: DataTypes.JSON, allowNull: true },
    denominatorUnit: { type: DataTypes.JSON, allowNull: true },
    presentationContentQuantity: { type: DataTypes.JSON, allowNull: true },
    presentationContainer: { type: DataTypes.JSON, allowNull: true },
    presentationContainerQuantity: { type: DataTypes.JSON, allowNull: true },
    prescriptionCondition: { type: DataTypes.JSON, allowNull: true },
    substituteDrugs: { type: DataTypes.JSON, allowNull: true },
    // Step 8 - Manufacturing & Importing Information
    manufacturingInfo: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    registrationNumber: { type: DataTypes.STRING, allowNull: true },
    mohCode: { type: DataTypes.STRING, allowNull: true },
    registrationDate: { type: DataTypes.DATE, allowNull: true },
    reviewDate: { type: DataTypes.DATE, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    flags: { type: DataTypes.JSON, allowNull: true },
}, {
    tableName: 'drugs_under_process',
    timestamps: true,
    indexes: [
        { fields: ['drugName'] },
        { fields: ['GTIN'] },
    ],
});

module.exports = DrugsUnderProcess;