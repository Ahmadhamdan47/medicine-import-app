// Import the swiftService module
const swiftService = require('../services/swiftService');

// Define an asynchronous function named 'submitSwift'
const submitSwift = async (req, res) => {
    // Extract the 'id' parameter from the request
    const { id } = req.params;
    
    // Extract the 'swiftNumber', 'date', 'amount', 'bankName', and 'attachedFile' properties from the request body
    const { swiftNumber, date, amount, bankName, attachedFile } = req.body;
    
    // Call the 'submitSwift' function from the swiftService module, passing the extracted data as arguments
    await swiftService.submitSwift(id, swiftNumber, date, amount, bankName, attachedFile);
    
    // Send a response with a success message
    res.send({ message: 'Swift submitted successfully' });
}

// Export the 'submitSwift' function to be used in other parts of the application
module.exports = { submitSwift };