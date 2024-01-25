// src/controllers/orderController.js

const { submitOrder } = require('../services/submittedOrderService');


const submitOrderController = async (req, res) => {
  try {
    const { guid, quantity } = req.body;
    const order = await submitOrder(guid, quantity);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

module.exports = {
  submitOrderController,
};