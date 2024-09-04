const { updateInspectionInspected, updateInspectionRejected } = require('../services/batchSerialService');

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

module.exports = {
  setInspectionInspected,
  setInspectionRejected,
};
