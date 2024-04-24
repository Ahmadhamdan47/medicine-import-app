// Import the piService module
const piService = require('../services/piService');

// Define an asynchronous function named 'submitPI'
const submitPI = async (req, res) => {
    // Extract the 'id' parameter from the request
    const { id } = req.params;
    
    // Extract the 'invoiceNumber', 'date', 'amount', and 'attachedFile' properties from the request body
    const { invoiceNumber, date, amount, attachedFile } = req.body;
    
    // Call the 'submitPI' function from the piService module, passing the extracted data as arguments
    await piService.submitPI(id, invoiceNumber, date, amount, attachedFile);
    
    // Send a response with a success message
    res.send({ message: 'PI submitted successfully' });
}

// Export the 'submitPI' function to be used in other parts of the application
module.exports = { submitPI };