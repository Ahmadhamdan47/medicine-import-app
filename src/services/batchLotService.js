const { v4: uuidv4 } = require('uuid');
const sequelize = require('../../config/databasePharmacy');
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

  if (serialNumber.length > 20) {
    throw new Error("SerialNumber cannot exceed 20 characters.");
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

/**
 * Retrieves all batch lots associated with a specific BoxId.
 * @param {number} boxId - The ID of the box to fetch batch lots for.
 * @returns {Promise<Array>} A promise that resolves to an array of batch lots.
 */
const getBatchLotsByBoxId = async (boxId) => {
  if (!boxId) {
    throw new Error("Missing required parameter: boxId must be provided.");
  }

  try {
    console.log(`Fetching batch lots for BoxId: ${boxId}`);

    // Fetch batch lots associated with the provided BoxId
    const batchLots = await BatchLotTracking.findAll({
      where: { BoxId: boxId },
    });

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
    console.log("Batch lots fetched successfully:", batchLots);
    return batchLots;
  } catch (error) {
    console.error(`Error fetching batch lots by BoxId: ${error.message}`);
    throw error;
  }
};

module.exports = {
  addBatchLot,
  getBatchLotsByBoxId, // Export the new service function
};
