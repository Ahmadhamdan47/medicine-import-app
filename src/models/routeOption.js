const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const RouteOption = sequelize.define('routeoptions', {
    RouteOptionId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Acronym: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    Route: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    Category: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    SoloMultiple: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    MultipleOption: {
        type: DataTypes.TEXT,
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
        type: DataTypes.INTEGER,
        allowNull: true
    },
    UpdatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'routeoptions',
    timestamps: false
});

module.exports = RouteOption;
