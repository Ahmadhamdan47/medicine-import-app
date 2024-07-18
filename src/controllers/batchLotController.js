const { addBatchLot } = require('../services/batchlotService');

const addBatchLotController = async (req, res) => {
  try {
	const { batchLotData, serialNumber } = req.body;
	const result = await addBatchLot(batchLotData, serialNumber);
	res.status(201).json({
	  message: 'Batch lot and serial number added successfully',
	  data: result,
	});
  } catch (error) {
	res.status(500).json({ message: `Error adding batch lot: ${error.message}` });
  }
};

module.exports = {
  addBatchLotController,
};