const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const DiseaseCategory = sequelize.define('DiseaseCategory', {
    DiseaseCategoryId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    CategoryName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    CategoryNameAr: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    IsEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    CreatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn('GETDATE')
    },
    UpdatedDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    CreatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    UpdatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'diseasecategory',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = DiseaseCategory;