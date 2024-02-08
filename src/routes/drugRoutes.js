// Import the 'express' module
const express = require('express');

// Create a new router object
const router = express.Router();

// Import the 'drugController' module
const drugController = require('../controllers/drugController');

// Define a route for GET requests to '/search/atc/:query', and assign the 'searchDrugByATCName' function from the 'drugController' module as the route handler
router.get('/search/atc/:query', drugController.searchDrugByATCName);

// Define a route for GET requests to '/search/brand/:query', and assign the 'searchDrugByBrandName' function from the 'drugController' module as the route handler
router.get('/search/brand/:query', drugController.searchDrugByBrandName);

// Define a route for GET requests to '/guid/:guid', and assign the 'getDrugByGuid' function from the 'drugController' module as the route handler
router.get('/guid/:guid', drugController.getDrugByGuid);

// Define a route for GET requests to '/filter/:query', and assign the 'filterDrugs' function from the 'drugController' module as the route handler
router.get('/filter/:query', drugController.filterDrugs);

// Define a route for POST requests to '/add', and assign the 'addDrug' function from the 'drugController' module as the route handler
router.post('/add', drugController.addDrug);

// Export the router object
module.exports = router;