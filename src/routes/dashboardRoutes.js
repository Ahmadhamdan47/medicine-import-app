const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/stats', dashboardController.getStats);
router.get('/drugs-by-manufacturer', dashboardController.getDrugsByManufacturer);
router.get('/drugs-by-country', dashboardController.getDrugsByCountry);

module.exports = router;
