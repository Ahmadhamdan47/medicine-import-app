
const batchLotService = require('../services/batchLotService');


const addBatchLotController = async (req, res) => {
  try {
	const { batchLotData, serialNumber } = req.body;
	const result = await batchLotService.addBatchLot(batchLotData, serialNumber);
	res.status(201).json({
	  message: 'Batch lot and serial number added successfully',
	  data: result,
	});
  } catch (error) {
	res.status(500).json({ message: `Error adding batch lot: ${error.message}` });
  }
};
const getBatchLotsByBoxId = async (req, res) => {
	const { boxId } = req.params;
  
	if (!boxId) {
	  return res.status(400).json({ error: "BoxId is required." });
	}
  
	try {
	  const batchLots = await batchLotService.getBatchLotsByBoxId(boxId);
	  if (!batchLots || batchLots.length === 0) {
		return res.status(404).json({ error: "No batch lots found for the given BoxId." });
	  }
	  return res.status(200).json(batchLots);
	} catch (error) {
	  console.error(`Error fetching batch lots by BoxId: ${error.message}`);
	  return res.status(500).json({ error: "An error occurred while fetching batch lots." });
	}
  };
  

module.exports = {
  addBatchLotController,
  getBatchLotsByBoxId
};