// Import the 'express' module
const express = require('express');

// Create a new router object
const router = express.Router();

// Import the 'shipmentController' module
const shipmentController = require('../controllers/shipmentController');

// Define a route for PUT requests to '/submit/:id', and assign the 'submitShipment' function from the 'shipmentController' module as the route handler
router.put('/submit/:id', shipmentController.submitShipment);

// Export the router object
module.exports = router;