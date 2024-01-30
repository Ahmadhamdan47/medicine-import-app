// Import the 'express' module
const express = require('express');

// Create a new router object
const router = express.Router();

// Import the 'agentStockController' module
const agentStockController = require('../controllers/agentStockController');

// Define a route for PUT requests to '/:id/stock', and assign the 'stockAgent' function from the 'agentStockController' module as the route handler
router.put('/:id/stock', agentStockController.stockAgent);

// Export the router object
module.exports = router;