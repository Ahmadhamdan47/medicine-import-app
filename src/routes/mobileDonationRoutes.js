const express = require('express');
const router = express.Router();
const mobileDonationController = require('../controllers/mobileDonationController');

router.get('/status', mobileDonationController.getMobileDonationStatus);

module.exports = router;
