const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const Doctor = sequelize.define('Doctor', {
    DoctorId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    Specialty: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    IsAssistant: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    DoctorParentId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Doctor',
            key: 'DoctorId'
        }
    }
}, {
    tableName: 'doctors',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = Doctor;