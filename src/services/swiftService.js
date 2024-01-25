const Swift = require('../models/swift');
const Shipment = require('../models/shipment');

const submitSwift = async (id, swiftNumber, date, amount, bankName, attachedFile) => {
    await Swift.update({ swiftNumber, date, amount, bankName, attachedFile }, { where: { id } });

    const swift = await Swift.findOne({ where: { id } });

    if (swiftNumber && date && amount && bankName && attachedFile) {
        await Shipment.create({ rfiId: swift.rfiId });
    }
}

module.exports = { submitSwift };