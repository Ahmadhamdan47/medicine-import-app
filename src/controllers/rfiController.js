// Import the rfiService module
const rfiService = require('../services/rfiService');

// Define an asynchronous function named 'editRfi'
const editRfi = async (req, res) => {
    // Extract the 'id' parameter from the request
    const { id } = req.params;
    
    // Extract the 'offerType', 'offerInput', and 'notes' properties from the request body
    const { offerType, offerInput, notes } = req.body;
    
    // Call the 'editRfi' function from the rfiService module, passing the extracted data as arguments
    await rfiService.editRfi(id, offerType, offerInput, notes);
    
    // Send a response with a success message
    res.send({ message: 'RFI updated successfully' });
}

// Define an asynchronous function named 'approveQuantity'
const approveQuantity = async (req, res) => {
    // Extract the 'id' parameter from the request
    const { id } = req.params;
    
    // Extract the 'quantityApproved' property from the request body
    const { quantityApproved } = req.body;
    
    // Call the 'approveQuantity' function from the rfiService module, passing the 'id' and 'quantityApproved' as arguments
    await rfiService.approveQuantity(id, quantityApproved);
    
    // Send a response with a success message
    res.send({ message: 'Quantity approved successfully' });
}

// Export the 'editRfi' and 'approveQuantity' functions to be used in other parts of the application
module.exports = { editRfi, approveQuantity };