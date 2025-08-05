const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Role = require('./roles');
const Donor = require('./donor');
const Recipient = require('./recipient'); // Add this line to import the Recipient model

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
    DonorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Donor,
            key: 'DonorId'
        }
    },
    RoleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Role,
            key: 'RoleId'
        }
    },
    RecipientId: { // Add this block
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Recipient,
            key: 'RecipientId'
        }
    },
    Email: { // Add this block
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    IsMainAccount: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    ParentUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'useraccounts',
            key: 'UserId'
        }
    },
    Permissions: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: ['view_donations', 'add_donations']
    },
    CreatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'useraccounts', 
            key: 'UserId'
        }
    }
}, {
    tableName: 'useraccounts',
    timestamps: false
});

module.exports = UserAccounts;