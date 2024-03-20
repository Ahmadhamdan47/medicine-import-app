const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Patient = require('./Patient');
const Doctor = require('./Doctor');

const Prescription = sequelize.define('Prescription', {
    PrescriptionId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    PatientId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Patient,
            key: 'PatientId'
        }
    },
    DoctorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Doctor,
            key: 'DoctorId'
        }
    },
    MedicationName: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    Dosage: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    Instructions: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    PrescriptionDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    IsDigital: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
}, {
    tableName: 'Prescription',
    timestamps: false
});

module.exports = Prescription;