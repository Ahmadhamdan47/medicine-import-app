const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');

router.put('/submit/:id', shipmentController.submitShipment);

module.exports = router;