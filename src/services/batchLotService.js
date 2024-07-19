const { v4: uuidv4 } = require('uuid');
const sequelize = require('../../config/databasePharmacy')
const BatchLotTracking = require("../models/BatchLot");
const BatchSerialNumber = require("../models/batchserialnumber");

/**
 * Adds a new batch lot and its serial number to the database.
 * @param {Object} batchLotData - The data for the new batch lot.
 * @param {string} serialNumber - The serial number associated with the new batch lot.
 * @returns {Promise<Object>} A promise that resolves to the newly added batch lot and serial number.
 */
const addBatchLot = async (batchLotData, serialNumber) => {
  if (!batchLotData || !serialNumber) {
    throw new Error("Missing required fields: batchLotData and serialNumber must be provided.");
  }

  let transaction;
  try {
    console.log("Starting transaction for adding a new batch lot...");

    // Start a transaction
    transaction = await sequelize.transaction();

    console.log("Transaction started successfully.");

    // Optionally add UUIDs or other fields as needed
    batchLotData.CreatedBy = uuidv4();
    batchLotData.UpdatedBy = uuidv4();
    console.log("UUIDs added to batchLotData:", { CreatedBy: batchLotData.CreatedBy, UpdatedBy: batchLotData.UpdatedBy });

    // Create the batch lot
    const batchLot = await BatchLotTracking.create(batchLotData, { transaction });
    console.log("Batch lot created successfully:", batchLot);

    // Create the batch serial number using the newly created batchLot's ID
    const batchSerialNumber = await BatchSerialNumber.create({
      BatchId: batchLot.BatchLotId,
      SerialNumber: serialNumber,
    }, { transaction });
    console.log("Batch serial number created successfully:", batchSerialNumber);

    // Commit the transaction
    await transaction.commit();
    console.log("Transaction committed successfully.");

    return {
      batchLot: batchLot,
      batchSerialNumber: batchSerialNumber,
    };
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
      console.log("Transaction rolled back due to error.");
    }
    console.error(`Error adding batch lot: ${error.message}`);
    throw error;
  }
};

module.exports = {
  addBatchLot,
};
