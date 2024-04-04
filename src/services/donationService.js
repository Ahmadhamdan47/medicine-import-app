const Donation = require("../models/donation");
const Donor = require("../models/Donor");
const Recipient = require("../models/recipient");
const Drug = require("../models/Drug");
const BatchLotTracking = require("../models/BatchLot");

/**
 * Asynchronously creates a new donation in the database based on the provided donation data.
 * @param {Object} donationData - Data for the new donation including DonorName.
 * @returns {Promise} A promise that resolves to the newly created donation.
 */

const createDonation = async (donationData) => {
  try {
    console.log("Received Donation Data:", donationData);

    const {
      DonorId,
      DonorName,
      RecipientId,
      DrugId,
      DrugName,
      GTIN,
      LOT,
      Serial,
      DonationDate,
      ProductionDate,
      ExpiryDate,
      Quantity,
      DonationPurpose,
      Laboratory,
      LaboratoryCountry,
    } = donationData;

    if (!ProductionDate) {
      throw new Error("ProductionDate is required");
    }

    let donor = await Donor.findOrCreate({
      where: { DonorName: DonorName },
      defaults: {
        CreatedDate: new Date(),
        IsActive: true,
      },
    });

    donor = donor[0];

    const drug = await Drug.findOne({
      where: {
        DrugName: DrugName,
      },
    });
    console.log("This is Drugggg", drug);
    if (!drug) {
      throw new Error("Drug not found");
    }

    const donation = await Donation.create({
      DonorId: donor.DonorId || DonorId,
      RecipientId: RecipientId,
      Quantity: Quantity,
      Serial: Serial,
      DonationPurpose: DonationPurpose,
      Laboratory: Laboratory,
      LaboratoryCountry: LaboratoryCountry,
      DonationDate: new Date(DonationDate),
    });

    await BatchLotTracking.create({
      DrugId: drug.DrugID,
      BatchNumber: LOT,
      ProductionDate: ProductionDate,
      ExpiryDate: ExpiryDate,
      Quantity: Quantity,
    });

    console.log("Donation successfully created:", donation);
    return donation;
  } catch (error) {
    console.error("Error creating donation:", error.message);
    throw error;
  }
};

/**
 * Retrieves all donations from the database.
 * @returns {Promise} A promise that resolves to an array of all donations.
 */
const getAllDonations = async () => {
  try {
    const allDonations = await Donation.findAll();
    return allDonations;
  } catch (error) {
    console.error("Error retrieving donations:", error.message);
    throw error;
  }
};

module.exports = {
  createDonation,
  getAllDonations,
};
