// Import the rfdService module
const rfdService = require('../services/rfdService');

// Define an asynchronous function named 'receiveRFD'
const receiveRFD = async (req, res) => {
    // Extract the 'id' parameter from the request
    const { id } = req.params;
    
    // Call the 'receiveRFD' function from the rfdService module, passing the 'id' as an argument
    await rfdService.receiveRFD(id);
    
    // Send a response with a success message
    res.send({ message: 'RFD declaration received successfully' });
}

// Export the 'receiveRFD' function to be used in other parts of the application
module.exports = { receiveRFD };