const BatchSerialNumber = require('../models/batchserialnumber');
const BatchLotTracking = require('../models/batchLot');

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
const checkDonationStatus = async ({ GTIN, BatchNumber, SerialNumber, ExpiryDate }) => {
  try {
    console.log('Input Parameters:', { GTIN, BatchNumber, SerialNumber, ExpiryDate });

    // Validate input parameters
    if (typeof GTIN !== 'string') {
      throw new Error('GTIN must be a string');
    }

    if (SerialNumber.length > 20) {
      throw new Error('SerialNumber cannot exceed 20 characters.');
    }

    // Query for the batch lot using GTIN, BatchNumber, and ExpiryDate
    const batchLot = await BatchLotTracking.findOne({
      where: {
        GTIN: GTIN,
        BatchNumber: BatchNumber,
        ExpiryDate: ExpiryDate,
      }
    });

    console.log('Batch lot found:', batchLot);

    if (!batchLot) {
      console.log('No batch lot found for GTIN:', GTIN, 'BatchNumber:', BatchNumber, 'ExpiryDate:', ExpiryDate);
      return {
        isValid: false,
        isDonated: false,
        messageEN: 'This combination of GTIN, LOT, Expiry Date, and Serial Number does not exist.',
        messageAR: 'هذا المزيج من GTIN ، LOT ، تاريخ انتهاء الصلاحية ، والرقم التسلسلي غير موجود.'
      };
    }

    // Ensure the SerialNumber is correctly formatted
    const formattedSerialNumber = SerialNumber.trim();

    // Query for the batch serial number using BatchId and SerialNumber
    const batchSerialNumber = await BatchSerialNumber.findOne({
      where: {
        BatchId: batchLot.BatchLotId,
        SerialNumber: formattedSerialNumber,
      }
    });

    console.log('Batch serial number lookup with BatchId:', batchLot.BatchLotId, 'and SerialNumber:', formattedSerialNumber);

    if (!batchSerialNumber) {
      console.log('No batch serial number found for BatchId:', batchLot.BatchLotId, 'SerialNumber:', formattedSerialNumber);
      return {
        isValid: false,
        isDonated: false,
        messageEN: 'This combination of GTIN, LOT, Expiry Date, and Serial Number does not exist.',
        messageAR: 'هذا المزيج من GTIN ، LOT ، تاريخ انتهاء الصلاحية ، والرقم التسلسلي غير موجود.'
      };
    }

    // Check if the batch lot has a DonationId associated
    if (!batchLot.DonationId) {
      console.log('Batch lot is not associated with a donation');
      return {
        isValid: true,
        isDonated: false,
        messageEN: 'This drug is found but not donated.',
        messageAR: 'هذا الدواء موجود لكنه غير متبرع به.'
      };
    }

    // Return a successful response indicating the drug is donated
    console.log('Batch lot is associated with a donation');
    return {
      isValid: true,
      isDonated: true,
      messageEN: 'This drug is already donated.',
      messageAR: 'هذا الدواء متبرع به.',
      batchLot: {
        BatchLotId: batchLot.BatchLotId,
        DrugName: batchLot.DrugName,
        Form: batchLot.Form,
        Presentation: batchLot.Presentation,
        Quantity: batchLot.Quantity,
        Laboratory: batchLot.Laboratory,
        LaboratoryCountry: batchLot.LaboratoryCountry,
        BoxId: batchLot.BoxId,
        DonationId: batchLot.DonationId
      }
    };
  } catch (error) {
    console.error('Error in checkDonationStatus:', error);
    throw error;
  }
};


module.exports = {
  updateInspectionInspected,
  updateInspectionRejected,
  checkDonationStatus
};
