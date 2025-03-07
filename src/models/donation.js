const { DataTypes } = require("sequelize");
const sequelize = require("../../config/databasePharmacy");

const Donation = sequelize.define(
  "donation",
  {
    DonationId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    DonationTitle: {
      type: DataTypes.STRING,
      allowNull: true,  // Or `false` if it should be required
  },
    DonorId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Donor",
        key: "DonorId",
      },
    },
    RecipientId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Recipient",
        key: "RecipientId",
      },
    },
    DonationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    DonationPurpose: {
      type: DataTypes.STRING(255),
    },
    UpdatedDate: {
      type: DataTypes.DATE,
    },
    NumberOfBoxes: {  // New field to store the number of boxes
      type: DataTypes.INTEGER,
      allowNull: true,  // Allow null to avoid issues with existing data
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      defaultValue: 'pending',
    },
  },
  
  {
    tableName: "donation",
    timestamps: true,
    underscored: true, // Optional: changes `createdAt` to `created_at`
  }
);

module.exports = Donation;
