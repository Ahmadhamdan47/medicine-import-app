const express = require('express');
const { addBatchLotController } = require('../controllers/batchLotController');

const router = express.Router();

router.post('/addBatchLot', addBatchLotController);

module.exports = router;