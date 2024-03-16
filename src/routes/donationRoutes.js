const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

router.post('/add', donationController.addDonation);

module.exports = router;