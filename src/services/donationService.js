// src/services/donationService.js
const Donation = require("../models/donation");
const Donor = require("../models/Donor");
const Recipient = require("../models/recipient");
const Drug = require("../models/Drug");
const BatchLotTracking = require("../models/BatchLot");

/**
 * Asynchronously creates a new donation in the database based on the provided donation data.
 * @param {Object} donationData - Data for the new donation.
 * @returns {Promise} A promise that resolves to the newly created donation.
 */
const createDonation = async (donationData) => {
  // Log the received donation data
  console.log("Donation Data:", donationData);

  const {
    DonorId,
    RecipientId,
    drugName,
    GTIN,
    LOT,
    ProductionDate,
    ExpiryDate,
    quantity,
    donationPurpose,
    Laboratory,
    LaboratoryCountry,
  } = donationData;

  // Fetch the donor data
  const donor = await Donor.findOne({
    where: {
      DonorId:DonorId
    }
  });

  if (!donor) {
    throw new Error('Donor not found');
  }

  // Fetch the drug data
  const drug = await Drug.findOne({
    where: {
      name: drugName
    }
  });

  if (!drug) {
    throw new Error('Drug not found');
  }

  // Create a new donation with the fetched data
  const donation = await Donation.create({
    DonorId: donor.id,
    RecipientId: RecipientId,
    Quantity: quantity,
    DonationPurpose: donationPurpose,
    Laboratory: Laboratory,
    LaboratoryCountry: LaboratoryCountry,
  });

  // Add a row in the BatchLotTracking table
  await BatchLotTracking.create({
    DrugId: drug.id,
    BatchNumber: LOT,
    ProductionDate: ProductionDate,
    ExpiryDate: ExpiryDate,
  });

  return donation;
};

module.exports = {
  createDonation
};