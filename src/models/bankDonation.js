const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const BankDonation = sequelize.define('BankDonation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    donor_type: {
        type: DataTypes.ENUM('personal', 'entity'),
        allowNull: false,
        comment: 'Type of donor - personal or entity'
    },
    account_holder: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Name of the account holder'
    },
    contact_person: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Contact person name (especially for entities)'
    },
    mobile_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Mobile phone number'
    },
    email_address: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            isEmail: true
        },
        comment: 'Email address of the donor'
    },
    amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Donation amount'
    },
    currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'Currency code (USD, LBP, etc.)'
    },
    status: {
        type: DataTypes.ENUM('pending', 'sent_to_bank', 'confirmed', 'rejected'),
        defaultValue: 'pending',
        comment: 'Status of the donation'
    },
    bank_email_sent_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Timestamp when email was sent to bank'
    },
    bank_reference_number: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Reference number from bank if provided'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Additional notes or comments'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'bank_donations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['donor_type']
        },
        {
            fields: ['status']
        },
        {
            fields: ['email_address']
        },
        {
            fields: ['created_at']
        }
    ]
});

module.exports = BankDonation;
