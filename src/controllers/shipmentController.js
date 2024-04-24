// Import the shipmentService module
const shipmentService = require('../services/shipmentService');

// Define an asynchronous function named 'submitShipment'
const submitShipment = async (req, res) => {
    // Extract the 'id' parameter from the request
    const { id } = req.params;
    
    // Extract the 'expectedDateOfArrival', 'borderCrossing', 'invoiceNumber', 'invoiceDate', 'invoiceAmount', 'invoiceAttachedFile', 'barcode2D', 'gtinNb', 'numberOfLots', 'batchNum', 'prodDate', 'expDate', and 'snLotNum' properties from the request body
    const { expectedDateOfArrival, borderCrossing, invoiceNumber, invoiceDate, invoiceAmount, invoiceAttachedFile, barcode2D, gtinNb, numberOfLots, batchNum, prodDate, expDate, snLotNum } = req.body;
    
    // Call the 'submitShipment' function from the shipmentService module, passing the extracted data as arguments
    await shipmentService.submitShipment(id, expectedDateOfArrival, borderCrossing, invoiceNumber, invoiceDate, invoiceAmount, invoiceAttachedFile, barcode2D, gtinNb, numberOfLots, batchNum, prodDate, expDate, snLotNum);
    
    // Send a response with a success message
    res.send({ message: 'Shipment submitted successfully' });
}

// Export the 'submitShipment' function to be used in other parts of the application
module.exports = { submitShipment };