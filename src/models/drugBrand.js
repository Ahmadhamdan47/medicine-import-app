const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Drug = require('./Drug');
const Brand = require('./brand');

const DrugBrand = sequelize.define('DrugBrand', {
    DrugId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Drug,
            key: 'DrugID'
        }
    },
    BrandId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Brand,
            key: 'BrandId'
        }
    }
}, {
    tableName: 'drugBrands',
    timestamps: false
});

module.exports = DrugBrand;