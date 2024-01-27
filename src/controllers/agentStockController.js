const agentStockService = require('../services/agentStockService');

const stockAgent = async (req, res) => {
    const { id } = req.params;
    await agentStockService.stockAgent(id);
    res.send({ message: 'Agent Stock updated successfully' });
}

module.exports = { stockAgent };