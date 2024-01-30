// Import the 'express' module
const express = require('express');

// Create a new router object
const router = express.Router();

// Import the 'rfiController' module
const rfiController = require('../controllers/rfiController');

// Define a route for PUT requests to '/edit/:id', and assign the 'editRfi' function from the 'rfiController' module as the route handler
router.put('/edit/:id', rfiController.editRfi); // id is a URL parameter

// Define a route for PUT requests to '/approve/:id', and assign the 'approveQuantity' function from the 'rfiController' module as the route handler
router.put('/approve/:id', rfiController.approveQuantity);

// Export the router object
module.exports = router;