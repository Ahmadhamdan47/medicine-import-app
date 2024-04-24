const AgentStock = require('../models/agentStock');
const SubmittedOrder = require('../models/submittedOrder');
const RFI = require('../models/rfi');
const PI = require('../models/pi');
// Import the 'Order' model
const Order = require('../models/order');

// Define an asynchronous function named 'stockAgent'
const stockAgent = async (id) => {
    // Update the 'inStock' field of the 'AgentStock' where the 'id' matches the provided 'id'
    await AgentStock.update({ inStock: true }, { where: { id } });

    // Find an 'AgentStock' where the 'id' matches the provided 'id'
    const agentStock = await AgentStock.findOne({ where: { id } });
    if (agentStock) {
        // Find a 'RFI' where the 'rfiId' matches the 'rfiId' of the found 'AgentStock'
        const rfi = await RFI.findOne({ where: { rfiId: agentStock.rfiId } });
        if (rfi) {
            // Update the 'stock' field of the 'SubmittedOrder' where the 'orderId' matches the 'orderId' of the found 'RFI'
            await SubmittedOrder.update({ stock: true }, { where: { orderId: rfi.orderId } });

            // Find a 'SubmittedOrder' where the 'orderId' matches the 'orderId' of the found 'RFI'
            const submittedOrder = await SubmittedOrder.findOne({ where: { orderId: rfi.orderId } });

            // Find a 'PI' where the 'rfiId' matches the 'rfiId' of the found 'RFI'
            const pi = await PI.findOne({ where: { rfiId: rfi.rfiId } });

            // If both 'submittedOrder' and 'pi' exist, create a new 'Order'
            if (submittedOrder && pi) {
                await Order.create({
                    brandName: submittedOrder.brandName,
                    orderId: submittedOrder.orderId,
                    quantity: submittedOrder.quantityRequested,
                    amount: pi.amount,
                    isAccepted: null
                });
            }
        }
    }
}

module.exports = {
    stockAgent
};