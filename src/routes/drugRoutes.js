// src/routes/drugRoutes.js

const express = require('express');
const router = express.Router();

// Import necessary controllers and services
const drugController = require('../controllers/drugController');

// Define routes
router.get('/search/:query', drugController.searchDrug); // Remove 'drugs' from the path

module.exports = router;