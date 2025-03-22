const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const DrugPresentation = sequelize.define('DrugPresentation', {
    PresentationId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    DrugId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Drug',
            key: 'DrugId'
        }
    },
    UnitQuantity1: {
        type: DataTypes.DECIMAL(18, 3)
    },
    UnitType1: {
        type: DataTypes.INTEGER,
        
    },
    UnitQuantity2: {
        type: DataTypes.DECIMAL(18, 3)
      
    },
    UnitType2:{
        type: DataTypes.INTEGER,

    },
    PackageQuantity1: {
        type: DataTypes.DECIMAL(18, 3)
    },
    PackageType1: {
        type: DataTypes.STRING(255)
    },
    PackageQuantity2: {
        type: DataTypes.DECIMAL(18, 3)
    },
    PackageType2: {
        type: DataTypes.STRING(255)
    }, 
    PackageQuantity3: {
        type: DataTypes.DECIMAL(18, 3)
    },
    PackageType3: {
        type: DataTypes.STRING(255)
    },
    Description:{
        type:DataTypes.TEXT
    },
    CreatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    UpdatedDate: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'drugpresentation',
    timestamps: false,
    indexes: [
        {
            fields: ['DrugId'],
            name: 'idx_presentation_drug_id'
        }
    ]
});


module.exports = DrugPresentation;