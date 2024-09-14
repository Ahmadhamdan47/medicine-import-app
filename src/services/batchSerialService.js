const BatchSerialNumber = require('../models/batchserialnumber');
const BatchLotTracking = require('../models/batchLot');
const  Donation  = require('../models/donation');  // Import Donation model
const Donor  = require('../models/donor');  // Import Donor model
const  Recipient  = require('../models/recipient');  //
const moment = require('moment');
const TIME_LIMIT_MINUTES = 15; // You can change this value as needed

/**
 * Update inspection status of a batch serial number to 'inspected'
 * @param {number} batchSerialNumberId - The ID of the batch serial number to update
 * @returns {Promise<Object>} - Resolves with a message or the updated batch serial number
 */
const updateInspectionInspected = async (batchSerialNumberId, inspectedBy) => { // Accept inspectedBy as a parameter
  try {
    const batchSerialNumber = await BatchSerialNumber.findByPk(batchSerialNumberId);

    if (!batchSerialNumber) {
      throw new Error('Batch serial number not found');
    }

    const now = moment(); // Get the current time
    const lastUpdated = moment(batchSerialNumber.lastUpdated);

    // Check if the time difference is within the allowed limit
    if (batchSerialNumber.lastUpdated && now.diff(lastUpdated, 'minutes') > TIME_LIMIT_MINUTES) {
      return { message: `Changes can only be made within ${TIME_LIMIT_MINUTES} minutes of the last update.` };
    }

    // Check if the SerialNumber is under report
    if (batchSerialNumber.Inspection === 'underReport') {
      return { message: 'This pack is under report and cannot be inspected or rejected.' };
    }

    // Check if the SerialNumber has already been inspected or rejected
    if (batchSerialNumber.Inspection === 'inspected') {
      return { message: 'This pack was already inspected before.' };
    }

    if (batchSerialNumber.Inspection === 'rejected') {
      return { message: 'This pack was already rejected before.' };
    }

    // Update the Inspection status to 'inspected', set inspectedBy, and lastUpdated timestamp
    batchSerialNumber.Inspection = 'inspected';
    batchSerialNumber.inspectedBy = inspectedBy; // Set inspectedBy to the value passed from the frontend
    batchSerialNumber.lastUpdated = now.toDate();
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

    const now = moment(); // Get the current time
    const lastUpdated = moment(batchSerialNumber.lastUpdated);

    // Check if the time difference is within the allowed limit
    if (batchSerialNumber.lastUpdated && now.diff(lastUpdated, 'minutes') > TIME_LIMIT_MINUTES) {
      return { message: `Changes can only be made within ${TIME_LIMIT_MINUTES} minutes of the last update.` };
    }

    // Check if the SerialNumber is under report
    if (batchSerialNumber.Inspection === 'underReport') {
      return { message: 'This pack is under report and cannot be inspected or rejected.' };
    }

    // Check if the SerialNumber has already been inspected or rejected
    if (batchSerialNumber.Inspection === 'inspected') {
      return { message: 'This pack was already inspected before.' };
    }

    if (batchSerialNumber.Inspection === 'rejected') {
      return { message: 'This pack was already rejected before.' };
    }

    // Update the Inspection status to 'rejected' and set the lastUpdated timestamp
    batchSerialNumber.Inspection = 'rejected';
    batchSerialNumber.lastUpdated = now.toDate();
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

    // Check if the batch serial number is under report
    if (batchSerialNumber.Inspection === 'underReport') {
      console.log('Batch serial number is under report');
      return {
        isValid: true,
        isDonated: true,
        messageEN: 'This pack is under report and cannot be processed further.',
        messageAR: 'هذه العبوة قيد التبليغ ولا يمكن معالجتها.',
        batchSerialNumberId: batchSerialNumber.BatchSerialNumberId
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
        BoxId: batchSerialNumber.BoxId,
        DonationId: batchLot.DonationId
      }
    };
  } catch (error) {
    console.error('Error in checkDonationStatus:', error);
    throw error;
  }
};

const fetchSerialNumberData = async (serialNumber) => {
  try {
    const serialNumberData = await BatchSerialNumber.findOne({
      where: { SerialNumber: serialNumber }
    });
    return serialNumberData;
  } catch (error) {
    console.error('Error fetching serial number data:', error);
    throw new Error('Failed to fetch serial number data');
  }
};
const getSerialNumbersByBoxId = async (boxId) => {
  if (!boxId) {
    throw new Error("Missing required parameter: boxId must be provided.");
  }

  try {
    console.log(`Fetching serial numbers for BoxId: ${boxId}`);

    // Fetch serial numbers associated with the provided BoxId
    const serialNumbers = await BatchSerialNumber.findAll({
      where: { BoxId: boxId },  // Find serial numbers related to the box
    });

    const serialNumbersWithBatchInfo = [];

    for (let serialNumber of serialNumbers) {
      // Fetch the corresponding batch lot using BatchId from the serial number
      const batchLot = await BatchLotTracking.findOne({
        where: { BatchLotId: serialNumber.BatchId }
      });

      // Prepare the result with both serial number and batch lot info
      const serialNumberWithBatchInfo = {
        BatchSerialNumberId: serialNumber.BatchSerialNumberId,
        SerialNumber: serialNumber.SerialNumber,
        Inspection: serialNumber.Inspection,
        BatchLotId: serialNumber.BatchId,
        DrugName: batchLot ? batchLot.DrugName : null,
        GTIN: batchLot ? batchLot.GTIN : null,
        BatchNumber: batchLot ? batchLot.BatchNumber : null,
        ExpiryDate: batchLot ? batchLot.ExpiryDate : null,
        Quantity: batchLot ? batchLot.Quantity : null,
        Laboratory: batchLot ? batchLot.Laboratory : null,
        LaboratoryCountry: batchLot ? batchLot.LaboratoryCountry : null,
        Presentation: batchLot ? batchLot.Presentation : null,
        Form: batchLot ? batchLot.Form :null,
      };

      serialNumbersWithBatchInfo.push(serialNumberWithBatchInfo);
    }

    console.log("Serial numbers with batch info fetched successfully:", serialNumbersWithBatchInfo);
    return serialNumbersWithBatchInfo;
  } catch (error) {
    console.error(`Error fetching serial numbers by BoxId: ${error.message}`);
    throw error;
  }
};

const reportBatchSerialNumber = async (batchSerialNumberId) => {
  try {
    // Fetch the batch serial number details
    const batchSerialNumber = await BatchSerialNumber.findByPk(batchSerialNumberId);

    if (!batchSerialNumber) {
      throw new Error('Batch serial number not found');
    }

    // Fetch the related batch lot information
    const batchLot = await BatchLotTracking.findOne({
      where: { BatchLotId: batchSerialNumber.BatchId }
    });

    if (!batchLot) {
      throw new Error('Batch lot not found');
    }

    // Fetch the related donation information
    const donation = await Donation.findOne({
      where: { DonationId: batchLot.DonationId }
    });

    if (!donation) {
      throw new Error('Donation not found');
    }

    // Fetch the donor and recipient information
    const donor = await Donor.findOne({
      where: { DonorId: donation.DonorId }
    });

    const recipient = await Recipient.findOne({
      where: { RecipientId: donation.RecipientId }
    });

    // Check if the SerialNumber is already under report
    if (batchSerialNumber.Inspection === 'underReport') {
      return { message: 'This pack is already under report and cannot be inspected or rejected.' };
    }

    // Update the Inspection status to 'underReport'
    batchSerialNumber.Inspection = 'underReport';
    await batchSerialNumber.save();

    // Construct and return the report details manually
    const reportDetails = {
      batchSerial: {
        id: batchSerialNumber.BatchSerialNumberId,
        serialNumber: batchSerialNumber.SerialNumber,
        inspectionStatus: batchSerialNumber.Inspection,
      },
      batchLot: {
        id: batchLot.BatchLotId,
        drugName: batchLot.DrugName,
        gtin: batchLot.GTIN,
        batchNumber: batchLot.BatchNumber,
        expiryDate: batchLot.ExpiryDate,
      },
      donation: {
        id: donation.DonationId,
        title: donation.DonationTitle,
        donor: donor ? donor.DonorName : null,
        recipient: recipient ? recipient.RecipientName : null
      }
    };

    return reportDetails;

  } catch (error) {
    throw new Error(`Failed to report the batch serial number: ${error.message}`);
  }
};


module.exports = {
  updateInspectionInspected,
  updateInspectionRejected,
  checkDonationStatus,
  fetchSerialNumberData,
  getSerialNumbersByBoxId,
  reportBatchSerialNumber
};
