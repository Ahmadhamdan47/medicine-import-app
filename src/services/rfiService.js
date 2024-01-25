const RFI = require('../models/rfi');
const PI = require('../models/pi');

const editRfi = async (rfiId, offerType, offerInput, notes) => {
    return await RFI.update({ offerType, offerInput, notes }, { where: { rfiId } });
}

const approveQuantity = async (rfiId, quantityApproved) => {
    await RFI.update({ isApproved: true, quantityApproved }, { where: { rfiId } });

    await PI.create({ rfiId });
}

module.exports = { editRfi, approveQuantity };