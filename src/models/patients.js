const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const Patient = sequelize.define('Patient', {
    PatientId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    FirstName: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    LastName: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    DateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    Gender: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    PhoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    Email: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    Address: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    IsActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
}, {
    tableName: 'patients',
    timestamps: false
});

module.exports = Patient;