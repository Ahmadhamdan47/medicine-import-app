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
    Amount: {
        type: DataTypes.DECIMAL(18, 3)
    },
    UnitId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'PresentationUnit',
            key: 'PresentationUnitId'
        }
    },
    TypeId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'PresentationType',
            key: 'PresentationTypeId'
        }
    },
    PackageType: {
        type: DataTypes.STRING(255)
    },
    PackageAmount: {
        type: DataTypes.DECIMAL(18, 3)
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
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = DrugPresentation;