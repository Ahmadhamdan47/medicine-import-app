const { updateInspectionInspected, updateInspectionRejected, checkDonationStatus, fetchSerialNumberData,getSerialNumbersByBoxId} = require('../services/batchSerialService');

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
const fetchSerialNumbersByBoxId = async (req, res) => {
  const { boxId } = req.params;  // Assuming BoxId is provided as a route parameter

  try {
    if (!boxId) {
      return res.status(400).json({
        success: false,
        message: "BoxId is required."
      });
    }

    // Call the service to get serial numbers and batch lot information
    const result = await getSerialNumbersByBoxId(boxId);

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No serial numbers found for BoxId: ${boxId}`
      });
    }

    // Success response with fetched data
    return res.status(200).json({
      success: true,
      message: `Serial numbers and batch lot information for BoxId: ${boxId}`,
      data: result
    });
  } catch (error) {
    console.error(`Error fetching serial numbers by BoxId: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`
    });
  }
};

module.exports = {
  setInspectionInspected,
  setInspectionRejected,
  checkDonationStatusController,
  getSerialNumberData,
  fetchSerialNumbersByBoxId
};