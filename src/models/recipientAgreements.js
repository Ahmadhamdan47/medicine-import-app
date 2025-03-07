const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Donation = require('./donation');
const Donor = require('./donor');
const Recipient = require('./recipient');

const RecipientAgreement = sequelize.define('RecipientAgreement', {
    AgreementId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    DonationId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    DonorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    RecipientId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Agreed_Upon: {
        type: DataTypes.ENUM('agreed', 'pending', 'refused'),
        allowNull: false
    },
    expenses_on: {
        type: DataTypes.ENUM('recipient', 'donor'),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
}, {
    tableName: 'recipientagreements',
    timestamps: false, // Automatically adds createdAt and updatedAt
});

// Define foreign key associations
RecipientAgreement.belongsTo(Donation, { foreignKey: 'DonationId' });
RecipientAgreement.belongsTo(Donor, { foreignKey: 'DonorId' });
RecipientAgreement.belongsTo(Recipient, { foreignKey: 'RecipientId' });

module.exports = RecipientAgreement;
