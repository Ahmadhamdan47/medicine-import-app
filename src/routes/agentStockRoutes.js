const express = require('express');
const router = express.Router();
const agentStockController = require('../controllers/agentStockController');

router.put('/:id/stock', agentStockController.stockAgent);

module.exports = router;