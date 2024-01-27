const RFD = require('../models/rfd');
const AgentStock = require('../models/agentStock');
const SubmittedOrder = require('../models/submittedOrder');
const RFI = require('../models/rfi');


const receiveRFD = async (id) => {
    await RFD.update({ isReceived: 'true' }, { where: { id } });

    const rfd = await RFD.findOne({ where: { id } });
    if (rfd) {
        await AgentStock.create({ rfiId: rfd.rfiId, inStock: false });

        const rfi = await RFI.findOne({ where: { rfiId: rfd.rfiId } });
        if (rfi) {
            // Update the RFD field in the SubmittedOrder
            await SubmittedOrder.update({ rfd: true }, { where: { orderId: rfi.orderId } });
        }
    }
}

module.exports = { receiveRFD };