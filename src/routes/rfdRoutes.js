// Import the 'express' module
const express = require('express');

// Create a new router object
const router = express.Router();

// Import the 'rfdController' module
const rfdController = require('../controllers/rfdController');

// Define a route for PUT requests to '/:id/receive', and assign the 'receiveRFD' function from the 'rfdController' module as the route handler
router.put('/:id/receive', rfdController.receiveRFD);

// Export the router object
module.exports = router;