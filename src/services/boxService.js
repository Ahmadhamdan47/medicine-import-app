// src/services/boxService.js
const Box = require('../models/box');

/**
 * Create a new box.
 * @param {Object} boxData - Data for the new box.
 * @returns {Promise} A promise that resolves to the newly created box.
 */
const createBox = async (boxData) => {
  const { DonationId, BoxLabel } = boxData;

  try {
    const newBox = await Box.create({
      DonationId: DonationId,
      BoxLabel: BoxLabel
    });
    return newBox;
  } catch (error) {
    console.error("Error creating box:", error);
    throw new Error(`Failed to create box: ${error.message}`);
  }
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

module.exports = {
  createBox,
  deleteBox,
  getBoxById,
  updateBox
};
