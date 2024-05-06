const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const FormParent = sequelize.define('FormParent', {
    FormParentId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    NameAr: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    CreatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    UpdatedDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    CreatedBy: {
        type: DataTypes.UUID,
        allowNull: true
    },
    UpdatedBy: {
        type: DataTypes.UUID,
        allowNull: true
    }
}, {
    tableName: 'formparent',
    timestamps: false
});

module.exports = FormParent;