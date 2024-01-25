const PI = require('../models/pi');
const Swift = require('../models/swift');

const submitPI = async (id, invoiceNumber, date, amount, attachedFile) => {
    await PI.update({ invoiceNumber, date, amount, attachedFile }, { where: { id } });

    const pi = await PI.findOne({ where: { id } })

    if (invoiceNumber && date && amount && attachedFile) {
        await Swift.create({ rfiId: pi.rfiId, date, amount });
    }

}

module.exports = { submitPI };