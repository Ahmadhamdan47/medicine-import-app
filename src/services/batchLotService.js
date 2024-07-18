const BatchLotTracking = require("../models/BatchLot");
const BatchSerialNumber = require("../models/batchserialnumber");

/**
 * Adds a new batch lot and its serial number to the database.
 * @param {Object} batchLotData - The data for the new batch lot.
 * @param {string} serialNumber - The serial number associated with the new batch lot.
 * @returns {Promise<Object>} A promise that resolves to the newly added batch lot and serial number.
 */
const addBatchLot = async (batchLotData, serialNumber) => {
  try {
	// Create the batch lot
	const batchLot = await BatchLotTracking.create(batchLotData);

	// Create the batch serial number using the newly created batchLot's ID
	const batchSerialNumber = await BatchSerialNumber.create({
	  BatchId: batchLot.BatchLotId,
	  SerialNumber: serialNumber,
	});

	return {
	  batchLot: batchLot,
	  batchSerialNumber: batchSerialNumber,
	};
  } catch (error) {
	console.error(`Error adding batch lot: ${error}`);
	throw error;
  }
};

module.exports = {
  addBatchLot,
};