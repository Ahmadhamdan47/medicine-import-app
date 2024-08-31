const express = require('express');
const  batchLotController  = require('../controllers/batchLotController');

const router = express.Router();

router.post('/addBatchLot', batchLotController.addBatchLotController);
router.get('/batchlots/byBox/:boxId', batchLotController.getBatchLotsByBoxId);

module.exports = router;