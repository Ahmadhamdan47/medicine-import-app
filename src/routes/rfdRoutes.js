const express = require('express');
const router = express.Router();
const rfdController = require('../controllers/rfdController');

router.put('/:id/receive', rfdController.receiveRFD);

module.exports = router;