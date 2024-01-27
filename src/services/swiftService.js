const Swift = require('../models/swift');
const Shipment = require('../models/shipment');
const SubmittedOrder = require('../models/submittedOrder');
const RFI = require('../models/rfi');

const submitSwift = async (id, swiftNumber, date, amount, bankName, attachedFile) => {
    await Swift.update({ swiftNumber, date, amount, bankName, attachedFile }, { where: { id } });

    const swift = await Swift.findOne({ where: { id } });

    if (swiftNumber && date && amount && bankName && attachedFile) {
        await Shipment.create({ rfiId: swift.rfiId });

        const rfi = await RFI.findOne({ where: { rfiId: swift.rfiId } });
        if (rfi) {
            // Update the Swift field in the SubmittedOrder
            await SubmittedOrder.update({ swift: true }, { where: { orderId: rfi.orderId } });
        }
    }
}

module.exports = { submitSwift };