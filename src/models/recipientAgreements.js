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
    }
}, {
    tableName: 'recipientagreements',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

// Define foreign key associations (if needed)
// Uncomment and adjust these lines if you want to define associations explicitly
 RecipientAgreement.belongsTo(Donation, { foreignKey: 'DonationId' });
    RecipientAgreement.belongsTo(Donor, { foreignKey: 'DonorId' });
    RecipientAgreement.belongsTo(Recipient, { foreignKey: 'RecipientId' });

module.exports = RecipientAgreement;