const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Drug = require('./drug');
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
    tableName: 'drugbrands',
    timestamps: false
});

module.exports = DrugBrand;