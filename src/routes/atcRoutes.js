// src/routes.js

const express = require('express');
const router = express.Router();
const ATCController = require('../controllers/atcController');

router.get('/atc/:drugID', ATCController.getATCByDrugID);

// Other routes...

module.exports = router;