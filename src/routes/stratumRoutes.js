const express = require('express');
const router = express.Router();
const { getPublicPrice, getStratumInfo } = require('../controllers/stratumController');

router.post('/calculatePrice', getPublicPrice);
router.get('/stratum/:stratumCode', getStratumInfo);

module.exports = router;
