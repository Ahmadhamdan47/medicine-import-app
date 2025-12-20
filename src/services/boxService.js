// src/services/boxService.js
const Box = require('../models/box');
const Donation = require('../models/donation');
const BatchSerialNumber = require('../models/batchserialnumber');
const { Sequelize } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');


/**
 * Create a new box.
 * @param {Object} boxData - Data for the new box.
 * @returns {Promise} A promise that resolves to the newly created box.
 */
const createBox = async (boxData) => {
    console.log("Box Data:", boxData);
  
    const {
      DonationId,
      BoxLabel,
      NumberOfPacks
    } = boxData;
  
    // Create the box record
    const box = await Box.create({
      DonationId: DonationId,
      BoxLabel: BoxLabel,
      NumberOfPacks: NumberOfPacks || 0,  // Initialize NumberOfPacks

    });
  
    // Update the NumberOfBoxes in the Donation model
    await Donation.increment('NumberOfBoxes', {
      where: {
        DonationId: DonationId,
      }
    });
  
    return box;
  };
  

/**
 * Delete a box by ID.
 * @param {number} boxId - ID of the box to delete.
 * @returns {Promise} A promise that resolves when the box is deleted.
 */
const deleteBox = async (boxId) => {
  try {
    await Box.destroy({
      where: {
        BoxId: boxId
      }
    });
  } catch (error) {
    console.error("Error deleting box:", error);
    throw new Error(`Failed to delete box: ${error.message}`);
  }
};

/**
 * Get a box by ID.
 * @param {number} boxId - ID of the box to retrieve.
 * @returns {Promise} A promise that resolves to the retrieved box.
 */
const getBoxById = async (boxId) => {
  try {
    const box = await Box.findOne({
      where: {
        BoxId: boxId
      }
    });

    if (!box) {
      throw new Error(`Box not found with ID: ${boxId}`);
    }

    return box;
  } catch (error) {
    console.error("Error getting box:", error);
    throw new Error(`Failed to get box: ${error.message}`);
  }
};

/**
 * Update a box.
 * @param {number} boxId - ID of the box to update.
 * @param {Object} updateData - Data to update the box with.
 * @returns {Promise} A promise that resolves to the updated box.
 */
const updateBox = async (boxId, updateData) => {
  try {
    const updatedBox = await Box.update(updateData, {
      where: {
        BoxId: boxId
      }
    });

    if (updatedBox[0] === 0) {
      throw new Error(`Box not found: ${boxId}`);
    }

    return updatedBox;
  } catch (error) {
    console.error("Error updating box:", error);
    throw new Error(`Failed to update box: ${error.message}`);
  }
};
const getBoxesByDonation = async (donationId) => {
    try {
        // Get all boxes with their actual pack count from batchserialnumber table
        const boxes = await Box.findAll({
            where: {
                DonationId: donationId
            },
            attributes: [
                'BoxId',
                'DonationId',
                'BoxLabel',
                'inspected',
                // Calculate actual NumberOfPacks from batchserialnumber count
                [sequelize.literal('(SELECT COUNT(*) FROM batchserialnumber WHERE batchserialnumber.BoxId = Box.BoxId)'), 'NumberOfPacks']
            ],
            having: sequelize.literal('(SELECT COUNT(*) FROM batchserialnumber WHERE batchserialnumber.BoxId = Box.BoxId) > 0'),
            order: [['BoxId', 'ASC']],
            raw: true
        });
        
        return boxes;
    } catch (error) {
        console.error('Error fetching boxes by donation ID:', error);
        throw error;
    }
};
const markBoxAsInspected = async (boxId) => {
    try {
      const result = await Box.update(
        { inspected: 'inspected' },
        { where: { BoxId: boxId } }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to mark box as inspected: ${error.message}`);
    }
  };
  
  // Function to mark a box as rejected
  const markBoxAsRejected = async (boxId) => {
    try {
      const result = await Box.update(
        { inspected: 'rejected' },
        { where: { BoxId: boxId } }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to mark box as rejected: ${error.message}`);
    }
  };
module.exports = {
  createBox,
  deleteBox,
  getBoxById,
  updateBox,
  getBoxesByDonation,
  markBoxAsInspected,
  markBoxAsRejected
};
