// Import the 'submitOrder' function from the submittedOrderService module
const { submitOrder } = require('../services/submittedOrderService');

// Define an asynchronous function named 'submitOrderController'
const submitOrderController = async (req, res) => {
  try {
    // Extract the 'guid' and 'quantity' properties from the request body
    const { guid, quantity } = req.body;
    
    // Call the 'submitOrder' function from the submittedOrderService module, passing the 'guid' and 'quantity' as arguments
    const order = await submitOrder(guid, quantity);
    
    // Send the order in the response
    res.json(order);
  } catch (error) {
    // If an error occurs, send a 500 status code and the error message in the response
    res.status(500).json({ error: error.toString() });
  }
};

// Export the 'submitOrderController' function to be used in other parts of the application
module.exports = {
  submitOrderController,
};