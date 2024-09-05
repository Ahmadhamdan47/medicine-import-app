const { updateInspectionInspected, updateInspectionRejected, checkDonationStatus, fetchSerialNumberData} = require('../services/batchSerialService');

/**
 * Controller to update inspection status to 'inspected'
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const setInspectionInspected = async (req, res) => {
  const { batchSerialNumberId } = req.params;

  try {
    const result = await updateInspectionInspected(batchSerialNumberId);

    if (result.message) {
      // If a message is returned, send it as a response
      return res.status(400).json({ message: result.message });
    }

    // If update is successful, return the updated object
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Controller to update inspection status to 'rejected'
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const setInspectionRejected = async (req, res) => {
  const { batchSerialNumberId } = req.params;

  try {
    const result = await updateInspectionRejected(batchSerialNumberId);

    if (result.message) {
      // If a message is returned, send it as a response
      return res.status(400).json({ message: result.message });
    }

    // If update is successful, return the updated object
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const checkDonationStatusController = async (req, res) => {
  const { GTIN, BatchNumber, SerialNumber, ExpiryDate } = req.body;

  try {
    const result = await checkDonationStatus({ GTIN, BatchNumber, SerialNumber, ExpiryDate });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSerialNumberData = async (req, res) => {
  const { serialNumber } = req.params;

  try {
    const serialNumberData = await fetchSerialNumberData(serialNumber);
    
    if (!serialNumberData) {
      return res.status(404).json({ error: 'Serial number not found' });
    }

    res.status(200).json(serialNumberData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  setInspectionInspected,
  setInspectionRejected,
  checkDonationStatusController,
  getSerialNumberData
};
