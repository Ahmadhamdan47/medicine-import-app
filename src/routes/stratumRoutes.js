const express = require('express');
const router = express.Router();
const { getPublicPrice } = require('../controllers/stratumController');

router.post('/calculatePrice', getPublicPrice);

module.exports = router;
