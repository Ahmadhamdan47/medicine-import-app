// src/services/donationService.js
const Donation = require("../models/donation");
const Donor = require("../models/donor");
const Recipient = require("../models/recipient");
const Drug = require("../models/drug");
const BatchLotTracking = require("../models/batchlot");
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
  console.log("Received Donation Data:", donationData);  // Log the incoming donation data

  const {
    DonorId,
    RecipientId,
    DonationTitle,  // Ensure DonationTitle is being destructured from donationData
    DonationPurpose,
    NumberOfBoxes,
  } = donationData;

  // Log the individual fields to verify they're being set correctly
  console.log("DonorId:", DonorId);
  console.log("RecipientId:", RecipientId);
  console.log("DonationTitle:", DonationTitle);
  console.log("DonationPurpose:", DonationPurpose);
  console.log("NumberOfBoxes:", NumberOfBoxes);

  // Validate that the donor exists
  const donor = await Donor.findOne({
    where: {
      DonorId: DonorId,
    }
  });

  if (!donor) {
    console.error('Donor not found with DonorId:', DonorId);  // Log an error if donor is not found
    throw new Error('Donor not found');
  }

  console.log("Donor found:", donor);  // Log the found donor

  try {
    // Create the donation record with the title
    const donation = await Donation.create({
      DonorId: donor.DonorId || DonorId,
      RecipientId: RecipientId,
      DonationTitle: DonationTitle,  // Log this to ensure it's being set
      DonationPurpose: DonationPurpose,
      DonationDate: new Date(),
      NumberOfBoxes: NumberOfBoxes || 0,
    });

    console.log("Donation created successfully:", donation);  // Log the created donation
    return donation;
  } catch (error) {
    console.error('Error creating donation:', error);  // Log any errors that occur during creation
    throw error;
  }
};

module.exports = {
  createDonation,
};


const createBatchLot = async (batchLotData) => {
  console.log("Batch Lot Data:", batchLotData);

  const {
    DonationId,
    BoxId,  // BoxId parameter is still needed to associate it with serial numbers
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

    // Create the batch lot record without the BoxId
    const batchLot = await BatchLotTracking.create({
      DonationId: DonationId,
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

    // Create the serial number record with the BoxId (but not for batch lot)
    const batchSerialNumber = await BatchSerialNumber.create({
      BatchId: batchLot.BatchLotId,
      BoxId: actualBoxId,  // Associate the serial number with the box
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
  const getDonationById = async (DonationId) => {
    try {
      const donation = await Donation.findOne({
        where: { DonationId: DonationId }
      });

      if (!donation) {
        throw new Error(`No donation found with id: ${DonationId}`);
      }
      const donor = await Donor.findOne({
        where: {DonorId: donation.DonorId}
      });
      const recipient = await Recipient.findOne({
        where: { RecipientId: donation.RecipientId }
      });
      if (donor){
        donation.dataValues.DonorName = donor.DonorName;
      }
      if (recipient) {
        donation.dataValues.RecipientName = recipient.RecipientName;
      }

      const batchLots = await BatchLotTracking.findAll({
        where: { DonationId: DonationId }
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
      console.error(`Error getting donation by id: ${DonationId}`, error);
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

const getFilteredDonations = async ({ donorId, recipientId, status, startDate, endDate }) => {
  try {
    const whereClause = {};

    if (donorId) {
      whereClause.DonorId = donorId;
    }
    if (recipientId) {
      whereClause.RecipientId = recipientId;
    }
    if (status) {
      whereClause.status = status;
    }
    if (startDate && endDate) {
      whereClause.DonationDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    } else if (startDate) {
      whereClause.DonationDate = {
        [Op.gte]: new Date(startDate),
      };
    } else if (endDate) {
      whereClause.DonationDate = {
        [Op.lte]: new Date(endDate),
      };
    }

    // Fetch donations based on filters
    const donations = await Donation.findAll({ where: whereClause });

    // Fetch donors and recipients separately
    for (let donation of donations) {
      if (donation.DonorId) {
        const donor = await Donor.findByPk(donation.DonorId, {
          attributes: ['DonorName'],
        });
        if (donor) {
          donation.dataValues.DonorName = donor.DonorName;
        }
      }

      if (donation.RecipientId) {
        const recipient = await Recipient.findByPk(donation.RecipientId, {
          attributes: ['RecipientName'],
        });
        if (recipient) {
          donation.dataValues.RecipientName = recipient.RecipientName;
        }
      }
    }

    return donations;
  } catch (error) {
    console.error('Error fetching filtered donations:', error);
    throw error;
  }
};

/**
 * Retrieves all donations associated with a specific recipient.
 * @param {number} recipientId - The ID of the recipient.
 * @returns {Promise<Array>} A promise that resolves to an array of donations for the recipient.
 */
const getDonationsByRecipient = async (recipientId) => {
  try {
    // Fetch all donations for the given recipientId
    const donations = await Donation.findAll({ where: { RecipientId: recipientId } });

    // Loop through each donation to enrich it with additional details
    for (let donation of donations) {
      // Fetch batch lots associated with the donation
      const batchLots = await BatchLotTracking.findAll({
        where: { DonationId: donation.DonationId },
      });

      // Fetch donor and recipient details
      const donor = await Donor.findOne({
        where: { DonorId: donation.DonorId },
      });
      const recipient = await Recipient.findOne({
        where: { RecipientId: donation.RecipientId },
      });

      // Add donor and recipient names to the donation data
      if (donor) {
        donation.dataValues.DonorName = donor.DonorName;
      }
      if (recipient) {
        donation.dataValues.RecipientName = recipient.RecipientName;
      }

      // Enrich batch lots with serial numbers and drug names
      for (let batchLot of batchLots) {
        const batchSerialNumber = await BatchSerialNumber.findOne({
          where: { BatchId: batchLot.BatchLotId },
        });

        // Add drug name and serial number to the batch lot data
        if (batchLot.DrugName) {
          batchLot.dataValues.DrugName = batchLot.DrugName;
        }
        if (batchSerialNumber) {
          batchLot.dataValues.SerialNumber = batchSerialNumber.SerialNumber;
        }
      }

      // Attach enriched batch lots to the donation
      donation.dataValues.BatchLotTrackings = batchLots.map((batchLot) => batchLot.dataValues);
    }

    // Return the enriched donations
    return donations.map((donation) => donation.dataValues);
  } catch (error) {
    console.error(`Error fetching donations for recipientId: ${recipientId}`, error);
    throw error;
  }
};

module.exports = {
  createDonation,
  createBatchLot, 
  getAllDonations,
getDonationById,
  editDonation,
  getDonationsByDonor,
  getFilteredDonations,
  getDonationsByRecipient, // Add the new function here

};
