const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Role = require('./Role');

const UserAccounts = sequelize.define('UserAccounts', {
    UserId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Username: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    PasswordHash: {
        type: DataTypes.STRING,
        allowNull: true
    },
    IsActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    PharmacyId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    DoctorId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    AgentId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    PatientId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    RoleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Role,
            key: 'RoleId'
        }
    }
}, {
    tableName: 'useraccounts',
    timestamps: false
});

module.exports = UserAccounts;