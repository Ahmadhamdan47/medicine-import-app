// src/services/donationService.js
const Donation = require("../models/donation");
const Donor = require("../models/donor");
const Recipient = require("../models/recipient");
const Drug = require("../models/drug");
const BatchLotTracking = require("../models/BatchLot");
const BatchSerialNumber = require("../models/batchserialnumber");
const Box = require("../models/box");
const { getDrugById } = require("./drugService");
drugService = require("./drugService");

/**
 * Asynchronously creates a new donation in the database based on the provided donation data.
 * @param {Object} donationData - Data for the new donation.
 * @returns {Promise} A promise that resolves to the newly created donation.
 */
const createDonation = async (donationData) => {
  console.log("Donation Data:", donationData);

  const {
    DonorId,
    RecipientId,
    donationPurpose,
    donationTitle, // New parameter for donation title
    numberOfBoxes,  // New parameter for number of boxes
  } = donationData;

  // Validate that the donor exists
  const donor = await Donor.findOne({
    where: {
      DonorId: DonorId
    }
  });

  if (!donor) {
    throw new Error('Donor not found');
  }

  // Create the donation record with the number of boxes and donation title
  const donation = await Donation.create({
    DonorId: donor.DonorId || DonorId,
    RecipientId: RecipientId,
    DonationPurpose: donationPurpose,
    DonationTitle: donationTitle || '', // Include DonationTitle here
    DonationDate: new Date(),
    NumberOfBoxes: numberOfBoxes || 0  // Initialize NumberOfBoxes to 0 if not provided
  });

  return donation;
};


const createBatchLot = async (batchLotData) => {
  console.log("Batch Lot Data:", batchLotData);

  const {
    DonationId,
    BoxId,  // Parameter for BoxId, may be null if creating a new box
    BoxLabel,  // New parameter for BoxLabel when creating a new box
    DrugName,
    GTIN,
    LOT,
    ProductionDate,
    ExpiryDate,
    Quantity,
    Presentation,
    Form,
    Laboratory,
    LaboratoryCountry,
    SerialNumber,
  } = batchLotData;

  let actualBoxId = BoxId;

  try {
    // If no BoxId is provided, create a new box
    if (!BoxId) {
      const newBox = await Box.create({
        DonationId: DonationId,
        BoxLabel: BoxLabel || `Box-${new Date().getTime()}`,  // Generate a unique BoxLabel if not provided
      });

      actualBoxId = newBox.BoxId;

      // Update the NumberOfBoxes in the Donation model
      await Donation.increment('NumberOfBoxes', {
        where: {
          DonationId: DonationId,
        }
      });
    }

    // Create the batch lot record with the actual BoxId
    const batchLot = await BatchLotTracking.create({
      DonationId: DonationId,
      BoxId: actualBoxId,
      DrugName: DrugName,
      Form: Form,
      Presentation: Presentation,
      GTIN: GTIN,
      BatchNumber: LOT,
      ProductionDate: ProductionDate,
      ExpiryDate: ExpiryDate,
      Quantity: Quantity,
      Laboratory: Laboratory,
      LaboratoryCountry: LaboratoryCountry,
    });

    // Assuming you have a separate table for serial numbers, create the serial number record
    const batchSerialNumber = await BatchSerialNumber.create({
      BatchId: batchLot.BatchLotId,
      SerialNumber: SerialNumber,
    });

    return {
      batchLot,
      batchSerialNumber,
    };
  } catch (error) {
    console.error("Error creating batch lot:", error);
    throw new Error(`Failed to create batch lot: ${error.message}`);
  }
};


const getAllDonations = async () => {
  try {
    const donations = await Donation.findAll();

    // Fetch the DrugName, DonorName, RecipientName and BatchSerialNumber for each donation
    for (let donation of donations) {
      const batchLots = await BatchLotTracking.findAll({
        where: { DonationId: donation.DonationId }
      });

      const donor = await Donor.findOne({
        where: { DonorId: donation.DonorId }
      });

      const recipient = await Recipient.findOne({
        where: { RecipientId: donation.RecipientId }
      });

      if (donor) {
        donation.dataValues.DonorName = donor.DonorName;
      }

      if (recipient) {
        donation.dataValues.RecipientName = recipient.RecipientName;
      }

      for (let batchLot of batchLots) {
        const batchSerialNumber = await BatchSerialNumber.findOne({
          where: { BatchId: batchLot.BatchLotId }
        });

        // Directly access the DrugName from the batchLot object
        if (batchLot.DrugName) {
          batchLot.dataValues.DrugName = batchLot.DrugName;
        }

        if (batchSerialNumber) {
          batchLot.dataValues.SerialNumber = batchSerialNumber.SerialNumber;
        }
      }

      donation.dataValues.BatchLotTrackings = batchLots.map(batchLot => batchLot.dataValues);
    }

    return donations.map(donation => donation.dataValues);
  } catch (error) {
    console.error(error);
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
      // Directly access the DrugName from the batchLot object
      if (batchLot.DrugName) {
        batchLot.dataValues.DrugName = batchLot.DrugName;
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
const getDonationsByDonor = async (donorId) => {
  try {
      const donations = await Donation.findAll({ where: { DonorId: donorId } });
      for (let donation of donations) {
        const batchLots = await BatchLotTracking.findAll({
          where: { DonationId: donation.DonationId }
        });
  
        const donor = await Donor.findOne({
          where: { DonorId: donation.DonorId }
        });
  
        const recipient = await Recipient.findOne({
          where: { RecipientId: donation.RecipientId }
        });
  
        if (donor) {
          donation.dataValues.DonorName = donor.DonorName;
        }
  
        if (recipient) {
          donation.dataValues.RecipientName = recipient.RecipientName;
        }
  
        for (let batchLot of batchLots) {
          const batchSerialNumber = await BatchSerialNumber.findOne({
            where: { BatchId: batchLot.BatchLotId }
          });
  
          // Directly access the DrugName from the batchLot object
          if (batchLot.DrugName) {
            batchLot.dataValues.DrugName = batchLot.DrugName;
          }
  
          if (batchSerialNumber) {
            batchLot.dataValues.SerialNumber = batchSerialNumber.SerialNumber;
          }
        }
  
        donation.dataValues.BatchLotTrackings = batchLots.map(batchLot => batchLot.dataValues);
      }
  
      return donations.map(donation => donation.dataValues);
    } catch (error) {
      console.error(error);
    }
};

module.exports = {
  createDonation,
  createBatchLot, 
  getAllDonations,
  getDonationById,
  editDonation,
  getDonationsByDonor,
};
