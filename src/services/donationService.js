// src/services/donationService.js
const Donation = require("../models/donation");
const Donor = require("../models/donor");
const Recipient = require("../models/recipient");
const Drug = require("../models/drug");
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
    Serial,
    ProductionDate,
    ExpiryDate,
    Quantity,
    Presentation,
    Form,
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
    DonorId: donor.DonorId ||DonorId,
    RecipientId: RecipientId,
    Quantity: Quantity,
    Presentation: Presentation,
    Form: Form,
    DonationPurpose: donationPurpose,
    Laboratory: Laboratory,
    LaboratoryCountry: LaboratoryCountry,
    donationDate: new Date(),
  });

  // Add a row in the BatchLotTracking table
  await BatchLotTracking.create({
    donationId: donation.DonationId,
    DrugId: drug.DrugID,
    BatchNumber: LOT,
    ProductionDate: ProductionDate,
    ExpiryDate: ExpiryDate,
    Quantity: Quantity,
    Serial: Serial,
  });

  return donation;
};

const getAllDonations = async () => {
  try {
    const donations = await Donation.findAll();

    // Fetch the DrugName for each donation
    for (let donation of donations) {
      const batchLots = await BatchLotTracking.findAll({
        where: { DonationId: donation.DonationId }
      });

      for (let batchLot of batchLots) {
        const drug = await Drug.findOne({
          where: { DrugID: batchLot.DrugId }
        });

        if (drug) {
          batchLot.dataValues.DrugName = drug.DrugName;
        }
      }

      donation.dataValues.BatchLotTrackings = batchLots;
    }

    return donations;
  } catch (error) {
    console.error('Error getting all donations:', error);
    throw error;
  }
};
const getDonationById = async (id) => {
  try {
    const donation = await Donation.findOne({
      where: { DonationId: id }
    });

    if (!donation) {
      throw new Error(`No donation found with id: ${id}`);
    }

    const recipient = await Recipient.findOne({
      where: { RecipientId: donation.RecipientId }
    });

    if (recipient) {
      donation.dataValues.RecipientName = recipient.RecipientName;
    }

    const batchLots = await BatchLotTracking.findAll({
      where: { DonationId: id }
    });

    // Fetch the DrugName for each BatchLotTracking record
    for (let batchLot of batchLots) {
      const drug = await Drug.findOne({
        where: { DrugID: batchLot.DrugId }
      });

      if (drug) {
        batchLot.dataValues.DrugName = drug.DrugName;
      }
    }

    donation.dataValues.BatchLotTrackings = batchLots;

    return donation;
  } catch (error) {
    console.error(`Error getting donation by id: ${id}`, error);
    throw error;
  }
};


const editDonation = async (DonationId, donationData) => {
  try {

    // Remove the DonationDate from the donationData object
    delete donationData.DonationDate;

    // Log the updated donation data
    console.log("Updated Donation Data:", donationData);

    // Add the current timestamp to the UpdatedDate field
    donationData.UpdatedDate = new Date();

    const donation = await Donation.update(donationData, {
      where: { DonationId }
    });

    if (donation[0] === 0) {
      throw new Error(`Donation not found: ${DonationId}`);
    }

    return donation;
  } catch (error) {
    console.error(`Error editing donation: ${DonationId}`, error);
    throw error;
  }
};

module.exports = {
  createDonation, 
  getAllDonations,
  getDonationById,
  editDonation
};
