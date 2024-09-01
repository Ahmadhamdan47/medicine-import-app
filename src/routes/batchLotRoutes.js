const express = require('express');
const  batchLotController  = require('../controllers/batchLotController');

const router = express.Router();

router.post('/addBatchLot', batchLotController.addBatchLotController);
router.get('/byBox/:boxId', batchLotController.getBatchLotsByBoxId);
router.post('/inspected/:batchId', batchLotController.markAsInspected);

// Route to mark batch lot as rejected
router.post('/rejected/:batchId', batchLotController.markAsRejected);

module.exports = router;