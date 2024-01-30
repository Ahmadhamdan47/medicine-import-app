// Import the 'express' module
const express = require('express');

// Create a new router object
const router = express.Router();

// Import the 'piController' module
const piController = require('../controllers/piController');

// Define a route for PUT requests to '/submit/:id', and assign the 'submitPI' function from the 'piController' module as the route handler
router.put('/submit/:id', piController.submitPI);

// Export the router object
module.exports = router;