const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');


const NewDrug = sequelize.define('Drug', {
    DrugID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    DrugName: {
        type: DataTypes.STRING(255)
    },
    ManufacturerID: {
        type: DataTypes.INTEGER
    },
    RegistrationNumber: {
        type: DataTypes.STRING(255)
    },
    GTIN: {
        type: DataTypes.STRING(255)
    },
    Notes: {
        type: DataTypes.TEXT
    },
    Description: {
        type: DataTypes.STRING(500)
    },
    IngredientAndStrength: {
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
        type: DataTypes.STRING(10)
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
    }
}, {
    tableName: 'drug',
    timestamps: false
});

module.exports = NewDrug;