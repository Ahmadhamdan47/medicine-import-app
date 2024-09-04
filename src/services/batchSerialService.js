const BatchSerialNumber = require('../models/batchserialnumber');

/**
 * Update inspection status of a batch serial number to 'inspected'
 * @param {number} batchSerialNumberId - The ID of the batch serial number to update
 * @returns {Promise<Object>} - Resolves with a message or the updated batch serial number
 */
const updateInspectionInspected = async (batchSerialNumberId) => {
  try {
    const batchSerialNumber = await BatchSerialNumber.findByPk(batchSerialNumberId);

    if (!batchSerialNumber) {
      throw new Error('Batch serial number not found');
    }

    // Check if the SerialNumber has already been inspected or rejected
    if (batchSerialNumber.Inspection === 'inspected') {
      return { message: 'This pack was already inspected before.' };
    }

    if (batchSerialNumber.Inspection === 'rejected') {
      return { message: 'This pack was already rejected before.' };
    }

    // Update the Inspection status to 'inspected'
    batchSerialNumber.Inspection = 'inspected';
    await batchSerialNumber.save();

    return batchSerialNumber;
  } catch (error) {
    throw new Error(`Failed to update inspection status: ${error.message}`);
  }
};

/**
 * Update inspection status of a batch serial number to 'rejected'
 * @param {number} batchSerialNumberId - The ID of the batch serial number to update
 * @returns {Promise<Object>} - Resolves with a message or the updated batch serial number
 */
const updateInspectionRejected = async (batchSerialNumberId) => {
  try {
    const batchSerialNumber = await BatchSerialNumber.findByPk(batchSerialNumberId);

    if (!batchSerialNumber) {
      throw new Error('Batch serial number not found');
    }

    // Check if the SerialNumber has already been inspected or rejected
    if (batchSerialNumber.Inspection === 'inspected') {
      return { message: 'This pack was already inspected before.' };
    }

    if (batchSerialNumber.Inspection === 'rejected') {
      return { message: 'This pack was already rejected before.' };
    }

    // Update the Inspection status to 'rejected'
    batchSerialNumber.Inspection = 'rejected';
    await batchSerialNumber.save();

    return batchSerialNumber;
  } catch (error) {
    throw new Error(`Failed to update inspection status: ${error.message}`);
  }
};

module.exports = {
  updateInspectionInspected,
  updateInspectionRejected,
};
