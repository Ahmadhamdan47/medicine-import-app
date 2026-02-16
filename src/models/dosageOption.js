const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const DosageOption = sequelize.define('dosageoptions', {
    DosageOptionId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    DosageFormClean: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    PhysicalState: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    SubstitutionRelationship: {
        type: DataTypes.STRING(200),
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
    tableName: 'dosageoptions',
    timestamps: false
});

module.exports = DosageOption;
