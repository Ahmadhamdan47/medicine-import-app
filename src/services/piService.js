const PI = require('../models/pi');
const Swift = require('../models/swift');
const SubmittedOrder = require('../models/submittedOrder');
const RFI = require('../models/rfi');

const submitPI = async (id, invoiceNumber, date, amount, attachedFile) => {
    await PI.update({ invoiceNumber, date, amount, attachedFile }, { where: { id } });

    const pi = await PI.findOne({ where: { id } })

    if (invoiceNumber && date && amount && attachedFile) {
        await Swift.create({ rfiId: pi.rfiId, date, amount });
        const rfi = await RFI.findOne({ where: { rfiId: pi.rfiId } });
        if (rfi) {
            // Update the PI field in the SubmittedOrder
            await SubmittedOrder.update({ PI: true }, { where: { orderId: rfi.orderId } });
        }
    }

}

module.exports = { submitPI };