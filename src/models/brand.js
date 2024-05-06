const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const Brand = sequelize.define('Brand', {
    BrandId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    BrandName: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: 'brands',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = Brand;