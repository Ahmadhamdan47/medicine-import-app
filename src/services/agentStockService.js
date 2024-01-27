const AgentStock = require('../models/agentStock');
const SubmittedOrder = require('../models/submittedOrder');
const RFI = require('../models/rfi');
const PI = require('../models/pi');
const Order = require('../models/order');

const stockAgent = async (id) => {
    await AgentStock.update({ inStock: true }, { where: { id } });

    const agentStock = await AgentStock.findOne({ where: { id } });
    if (agentStock) {
        const rfi = await RFI.findOne({ where: { rfiId: agentStock.rfiId } });
        if (rfi) {
            // Update the AgentStock field in the SubmittedOrder
            await SubmittedOrder.update({ stock: true }, { where: { orderId: rfi.orderId } });

            const submittedOrder = await SubmittedOrder.findOne({ where: { orderId: rfi.orderId } });

            // Get the PI with the same rfiId
            const pi = await PI.findOne({ where: { rfiId: rfi.rfiId } });

            // Create a new Order
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

module.exports = { stockAgent };