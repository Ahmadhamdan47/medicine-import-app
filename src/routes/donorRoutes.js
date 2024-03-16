const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');

router.post('/add', donorController.addDonor);

module.exports = router;