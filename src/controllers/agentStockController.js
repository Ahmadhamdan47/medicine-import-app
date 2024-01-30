// Import the agentStockService module
const agentStockService = require('../services/agentStockService');

// Define an asynchronous function named 'stockAgent'
const stockAgent = async (req, res) => {
    // Extract the 'id' parameter from the request
    const { id } = req.params;
    
    // Call the 'stockAgent' function from the agentStockService module, passing the 'id' as an argument
    await agentStockService.stockAgent(id);
    
    // Send a response with a success message
    res.send({ message: 'Agent Stock updated successfully' });
}

// Export the 'stockAgent' function to be used in other parts of the application
module.exports = { stockAgent };