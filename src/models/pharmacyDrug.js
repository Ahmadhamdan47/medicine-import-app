const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const PharmacyDrug = sequelize.define('Drug_List', {
    Guid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    ATCGuid: {
        type: DataTypes.UUID,
        allowNull: false
    },
    DosageGuid: {
        type: DataTypes.UUID
    },
    PresentationGuid: {
        type: DataTypes.UUID
    },
    FormGuid: {
        type: DataTypes.UUID
    },
    RouteGuid: {
        type: DataTypes.UUID
    },
    StratumGuid: {
        type: DataTypes.UUID
    },
    StratumTypeGuid: {
        type: DataTypes.UUID
    },
    AgentGuid: {
        type: DataTypes.UUID
    },
    BrandGuid: {
        type: DataTypes.UUID
    },
    ManufacturerGuid: {
        type: DataTypes.UUID
    },
    CountryGuid: {
        type: DataTypes.UUID
    },
    ResponsiblePartyGuid: {
        type: DataTypes.UUID
    },
    DrugLabelGuid: {
        type: DataTypes.UUID
    },
    Code: {
        type: DataTypes.STRING
    },
    RegistrationNumber: {
        type: DataTypes.STRING
    },
    REP_date: {
        type: DataTypes.DATE
    },
    IsDouanes: {
        type: DataTypes.BOOLEAN
    },
    Date_dc: {
        type: DataTypes.DATE
    },
    LASTEffective_Date: {
        type: DataTypes.DATE
    },
    CIF_FOB: {
        type: DataTypes.STRING
    },
    LASTPublicABP: {
        type: DataTypes.DECIMAL(18, 6)
    },
    LASTCurrencyGuid: {
        type: DataTypes.UUID
    },
    SubsidyLabel: {
        type: DataTypes.STRING
    },
    SubsidyPercentage: {
        type: DataTypes.DECIMAL(18, 6)
    },
    LJ_FOB_ValueUSD: {
        type: DataTypes.DECIMAL(18, 6)
    },
    HospPricing: {
        type: DataTypes.BOOLEAN
    },
    WJ_Leb_PubPriceHos: {
        type: DataTypes.STRING
    },
    Seq: {
        type: DataTypes.STRING
    },
    B_G: {
        type: DataTypes.STRING
    },
    Substitutable: {
        type: DataTypes.BOOLEAN
    },
    WEBCIF_FOB: {
        type: DataTypes.STRING
    },
    WEBPublicABP: {
        type: DataTypes.DECIMAL(18, 6)
    },
    WEBCurrency: {
        type: DataTypes.UUID
    },
    NM: {
        type: DataTypes.BOOLEAN
    },
    GTIN: {
        type: DataTypes.STRING
    },
    Notes: {
        type: DataTypes.STRING
    },
    Description: {
        type: DataTypes.STRING
    },
    ActiveInactiveIngredient: {
        type: DataTypes.STRING
    },
    Indication: {
        type: DataTypes.STRING
    },
    Posology: {
        type: DataTypes.STRING
    },
    MethodOfAdministration: {
        type: DataTypes.STRING
    },
    Contraindications: {
        type: DataTypes.STRING
    },
    PrecautionForUse: {
        type: DataTypes.STRING
    },
    EffectOnFGN: {
        type: DataTypes.STRING
    },
    SideEffect: {
        type: DataTypes.STRING
    },
    Toxicity: {
        type: DataTypes.STRING
    },
    StorageCondition: {
        type: DataTypes.STRING
    },
    ShelfLife: {
        type: DataTypes.STRING
    },
    IngredientLabel: {
        type: DataTypes.STRING
    },
    IsBiological: {
        type: DataTypes.BOOLEAN
    },
    IsNarcotis: {
        type: DataTypes.BOOLEAN
    },
    IsOTC: {
        type: DataTypes.BOOLEAN
    },
    IsNSSF: {
        type: DataTypes.BOOLEAN
    },
    CreatedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    CreatedBy: {
        type: DataTypes.UUID
    },
    UpdatedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    UpdatedBy: {
        type: DataTypes.UUID
    }
}, {
    tableName: 'Drug_List',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = PharmacyDrug;
