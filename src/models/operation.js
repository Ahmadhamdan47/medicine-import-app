const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const CategoryPricing = require('./categoryPricing');
const OperationShare = require('./operationShare');
const HospitalOperationMapping = require('./hospitalOperationMapping');
const NSSFOperationCoverage = require('./nssfOperationCoverage');

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
HospitalOperationMapping.belongsTo(Operation, { foreignKey: 'OperationId' });

// NSSF Operation Coverage Association
Operation.hasMany(NSSFOperationCoverage, {
    foreignKey: 'operation_id',
    as: 'nssfCoverage'
});
NSSFOperationCoverage.belongsTo(Operation, {
    foreignKey: 'operation_id',
    as: 'operation'
});

module.exports = Operation;