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
  try {
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

    // Fetch donor and recipient by their IDs
    const donor = await Donor.findByPk(DonorId);
    const recipient = await Recipient.findByPk(RecipientId);
    // Log the donor ID
    console.log("Donor ID:", DonorId);
    // Log the recipient ID
    console.log("Recipient ID:", RecipientId);

    // Fetch drug by its name and GTIN
    const drug = await Drug.findOne({ where: { name: drugName, GTIN: GTIN } });

    // Throw an error if donor, recipient, or drug is not found
    // if (!donor || !recipient || !drug) {
    //   throw new Error("Donor, recipient, or drug not found");
    // }

    // Check if the LaboratoryCountry or the donor's country is 'Israel'
    if (LaboratoryCountry === "Israel" || donor.country === "Israel") {
      throw new Error("This drug is not acceptable");
    }

    // Create a new donation with the fetched data
    const donation = await Donation.create({
      RecipientId: recipient.id,
      Quantity: quantity,
      DonationPurpose: donationPurpose,
      Laboratory: Laboratory,
      LaboratoryCountry: LaboratoryCountry,
    });

    // const donation = await Donation.create({
    //   DonorId: donor.id,
    //   RecipientId: recipient.id,
    //   Quantity: quantity,
    //   DonationPurpose: donationPurpose,
    //   Laboratory: Laboratory,
    //   LaboratoryCountry: LaboratoryCountry,
    // });

    // Add a row in the BatchLotTracking table
    await BatchLotTracking.create({
      DrugId: drug.id,
      BatchNumber: LOT,
      ProductionDate: ProductionDate,
      ExpiryDate: ExpiryDate,
      Quantity: quantity,
    });

    // Return the newly created donation
    return donation;
  } catch (error) {
    // Throw an error with a message indicating the failure in the donation service
    throw new Error("Error in donationService: " + error.message);
  }
};

const getDonationById = async (id) => {
  try {
    const donation = await Donation.findByPk(id);
    return donation;
  } catch (error) {
    throw new Error("Error in donationService: " + error.message);
  }
};

const getAllDonations = async () => {
  try {
    const donations = await Donation.findAll();
    return donations;
  } catch (error) {
    throw new Error("Error in donationService: " + error.message);
  }
};

const updateDonation = async (id, updatedData) => {
  try {
    const donation = await Donation.update(updatedData, {
      where: {
        id: id,
      },
    });
    return donation;
  } catch (error) {
    throw new Error("Error in donationService: " + error.message);
  }
};

const deleteDonation = async (id) => {
  try {
    const donation = await Donation.destroy({
      where: {
        id: id,
      },
    });
    return donation;
  } catch (error) {
    throw new Error("Error in donationService: " + error.message);
  }
};

module.exports = {
  createDonation,
  getDonationById,
  getAllDonations,
  updateDonation,
  deleteDonation,
};
