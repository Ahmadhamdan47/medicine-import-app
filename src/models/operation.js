const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const CategoryPricing = require('./categoryPricing');
const OperationShare = require('./operationShare');
const HospitalOperationMapping = require('./hospitalOperationMapping');

const Operation = sequelize.define('operation', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Name: {
        type: DataTypes.STRING,
    },
    NameAR: {
        type: DataTypes.STRING,
    },
    Code: {
        type: DataTypes.STRING,
    },
    systemChar: {
        type: DataTypes.CHAR,
    },
    Anesthetic: {
        type: DataTypes.ENUM('L','G'),
    },
    Los:{
        type: DataTypes.INTEGER,
    },
    Description: {
        type: DataTypes.TEXT,
    },
    DescriptionAR: {
        type: DataTypes.TEXT,
    },
}, {
    sequelize,
    tableName: 'operation',
});

Operation.hasMany(CategoryPricing, {
    foreignKey: 'OperationId'
});
Operation.hasMany(HospitalOperationMapping, { foreignKey: 'OperationId' });

module.exports = Operation;