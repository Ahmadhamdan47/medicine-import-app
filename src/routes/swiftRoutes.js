// Import the 'express' module
const express = require('express');

// Create a new router object
const router = express.Router();

// Import the 'swiftController' module
const swiftController = require('../controllers/swiftController');

// Define a route for PUT requests to '/submit/:id', and assign the 'submitSwift' function from the 'swiftController' module as the route handler
router.put('/submit/:id', swiftController.submitSwift);

// Export the router object
module.exports = router;