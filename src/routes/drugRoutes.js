// src/routes/drugRoutes.js

const express = require('express');
const router = express.Router();

// Import necessary controllers
const drugController = require('../controllers/drugController');
// src/controllers/drugController.js

// Define routes
router.get('/search/atc/:query', drugController.searchDrugByATCName);
router.get('/search/brand/:query', drugController.searchDrugByBrandName);
router.get('/guid/:guid', drugController.getDrugByGuid);
router.get('/filter/:query', drugController.filterDrugs);

module.exports = router;