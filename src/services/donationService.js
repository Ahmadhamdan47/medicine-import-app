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
    DrugName,
    GTIN,
    LOT,
    ProductionDate,
    ExpiryDate,
    Quantity,
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
      DrugName: DrugName
    }
  });

  if (!drug) {
    throw new Error('Drug not found');
  }

  // Create a new donation with the fetched data
  const donation = await Donation.create({
    DonorId: donor.DonorId,
    RecipientId: RecipientId,
    Quantity: Quantity,
    DonationPurpose: donationPurpose,
    Laboratory: Laboratory,
    LaboratoryCountry: LaboratoryCountry,
  });

  // Add a row in the BatchLotTracking table
  await BatchLotTracking.create({
    DrugId: drug.DrugId,
    BatchNumber: LOT,
    ProductionDate: ProductionDate,
    ExpiryDate: ExpiryDate,
    Quantity: Quantity,
  });

  return donation;
};

module.exports = {
  createDonation
};