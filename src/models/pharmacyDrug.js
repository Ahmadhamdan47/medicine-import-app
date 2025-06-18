const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const DrugPresentation = require('./drugPresentation');
const Dosage = require('./dosage');
const NSSFPricing = require('./nssfPricing');
const NewDrug = sequelize.define('drug', {
    DrugID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    DrugName: {
        type: DataTypes.STRING(255)
    },
    DrugNameAR: {
        type: DataTypes.STRING(255)
    },
    ATC_Code: {
        type: DataTypes.STRING(255),
        allowNull: true, // or false if it should be mandatory
    },
    GTIN:{
        type: DataTypes.BIGINT(100),
        allowNull: true,
    },
    isOTC:{
        type: DataTypes.BOOLEAN
    },
    Form:{
        type: DataTypes.STRING(255)
    },
    FormLNDI:{
        type: DataTypes.STRING(255)
    },
    FormRaw:{
        type: DataTypes.STRING(255)
    },
    IsScored:{
        type: DataTypes.BOOLEAN
    },
    Presentation:{
        type: DataTypes.STRING(255)
    
    },
    Stratum: {
        type: DataTypes.STRING(255)
    },
    Dosage : {
        type: DataTypes.STRING(255)
    },
    Amount: {
        type: DataTypes.INTEGER
    },
    Route: {
        type: DataTypes.STRING(255)
    },
    Parentaral:{
        type: DataTypes.STRING(255)
    },
    RouteParent:{
        type: DataTypes.STRING(255)
    },

    Agent: {
        type: DataTypes.STRING(255)
    },
    Manufacturer: {
        type: DataTypes.STRING(255)
    },
    ResponsibleParty: {
        type: DataTypes.STRING(255)
    },
    Country : {
        type: DataTypes.STRING(255)
    },
    ResponsiblePartyCountry: {
        type: DataTypes.STRING(255)
    },

    RegistrationNumber: {
        type: DataTypes.STRING(255)
    },
    Notes: {
        type: DataTypes.TEXT
    },
    Description: {
        type: DataTypes.STRING(500)
    },
    Indication: {
        type: DataTypes.STRING(500)
    },
    Posology: {
        type: DataTypes.STRING(500)
    },
    MethodOfAdministration: {
        type: DataTypes.STRING(500)
    },
    Contraindications: {
        type: DataTypes.STRING(500)
    },
    PrecautionForUse: {
        type: DataTypes.STRING(500)
    },
    EffectOnFGN: {
        type: DataTypes.STRING(500)
    },
    SideEffect: {
        type: DataTypes.STRING(500)
    },
    Toxicity: {
        type: DataTypes.STRING(500)
    },
    StorageCondition: {
        type: DataTypes.STRING(500)
    },
    ShelfLife: {
        type: DataTypes.STRING(500)
    },
    IngredientLabel: {
        type: DataTypes.STRING(500)
    },
    Price: {
        type: DataTypes.DECIMAL(18, 6)
    },
    ImagesPath: {
        type: DataTypes.TEXT
    },
    ImageDefault: {
        type: DataTypes.BOOLEAN
    },
    InteractionIngredientName: {
        type: DataTypes.STRING(255)
    },
    IsDouanes: {
        type: DataTypes.BOOLEAN
    },
    RegistrationDate: {
        type: DataTypes.DATE
    },
    PublicPrice: {
        type: DataTypes.DECIMAL(18, 6)
    },
    SubsidyLabel: {
        type: DataTypes.STRING(255)
    },
    SubsidyPercentage: {
        type: DataTypes.DECIMAL(18, 6)
    },
    HospPricing: {
        type: DataTypes.BOOLEAN
    },
    Substitutable: {
        type: DataTypes.BOOLEAN
    },
    CreatedBy: {
        type: DataTypes.UUID
    },
    CreatedDate: {
        type: DataTypes.DATE
    },
    UpdatedBy: {
        type: DataTypes.UUID
    },
    UpdatedDate: {
        type: DataTypes.DATE
    },
    OtherIngredients: {
        type: DataTypes.STRING(500)
    },
    ATCRelatedIngredient: {
        type: DataTypes.STRING(500)
    },
    ReviewDate: {
        type: DataTypes.DATE
    },
    MoPHCode: {
        type: DataTypes.INTEGER,
        allowNull: false // Optional: Add constraints if needed
    },
    
    CargoShippingTerms: {
    type: DataTypes.STRING(255)
    },
    ProductType: {
        type: DataTypes.STRING(255)
    },
    NotMarketed: {
        type: DataTypes.BOOLEAN
    },
    DFSequence: {
        type: DataTypes.STRING(255)
    },
    PriceForeign: {
        type: DataTypes.DECIMAL(18, 6)
    },
    CurrencyForeign: {
        type: DataTypes.UUID
    },
    Seq:{
        type: DataTypes.STRING(255)
    },
    PresentationLNDI:{
        type: DataTypes.STRING(255)
    },
    RouteLNDI:{
        type: DataTypes.STRING(255)
    },
    RouteRaw:{
        type: DataTypes.STRING(255)
    },
    rep: {
        type: DataTypes.BOOLEAN
    },
    "2019": {
        type: DataTypes.BOOLEAN
    },
    "2021": {
        type: DataTypes.BOOLEAN
    },
    "2022": {
        type: DataTypes.BOOLEAN
    },
    "2023": {
        type: DataTypes.BOOLEAN
    },
    "2024": {
        type: DataTypes.BOOLEAN
    },
    "2025": {
        type: DataTypes.BOOLEAN
    },
    "2026": {
        type: DataTypes.BOOLEAN
    },
    "2027": {
        type: DataTypes.BOOLEAN
    },
    "2028": {
        type: DataTypes.BOOLEAN
    },
    registrationDay: {
        type: DataTypes.STRING
    },
    registrationMonth: {
        type: DataTypes.STRING
    },
    registrationYear: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'drug',
    timestamps: false ,
    indexes: [
        {
            name: 'idx_drug_name',
            fields: ['DrugName']
        },
        {
            name: 'idx_drug_name_ar',
            fields: ['DrugNameAR']
        },
        // Remove/comment out the duplicate index below:
        // { name: 'idx_atc_related', fields: ['ATCRelatedIngredient'] },
        {
            name: 'idx_gtin',
            fields: ['GTIN']
        },
        {
            name: 'idx_moph_code',
            fields: ['MoPHCode']
        },
        {
            name: 'idx_form',
            fields: ['Form']
        },
        {
            name: 'idx_route',
            fields: ['Route']
        },
        {
            name: 'idx_not_marketed',
            fields: ['NotMarketed', 'DrugID']
        },
        {
            name: 'idx_is_otc',
            fields: ['isOTC']
        },
        {
            name: 'idx_manufacturer',
            fields: ['Manufacturer']
        }
    ]
    
});
// Add these indexes to your Drug model

NewDrug.hasMany(DrugPresentation, { foreignKey: 'DrugId' }); // Drug can have many presentations
DrugPresentation.belongsTo(NewDrug, { foreignKey: 'DrugId' }); // Each presentation belongs to a drug
NewDrug.hasMany(Dosage, { foreignKey: 'DrugId' }); // Drug can have many presentations
Dosage.belongsTo(NewDrug, { foreignKey: 'DrugId' }); // Each presentation belongs to a drug

// Add NSSF Pricing relationship

NewDrug.hasMany(NSSFPricing, { foreignKey: 'drug_id', as: 'nssfPricing' });
NSSFPricing.belongsTo(NewDrug, { foreignKey: 'drug_id', as: 'drug' });

module.exports = NewDrug;