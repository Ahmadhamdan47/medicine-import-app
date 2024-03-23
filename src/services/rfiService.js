const RFI = require('../models/rfi');
const PI = require('../models/pi');
const submittedOrder = require('../models/submittedOrder');

const editRfi = async (rfiId, offerType, offerInput, notes) => {

    if (offerType && offerInput && notes) {
        await RFI.update({ offerType, offerInput, notes }, { where: { rfiId } });

        // After updating the RFI, get the orderId
        const rfi = await RFI.findOne({ where: { rfiId } });
        if (rfi) {
            // Update the RFI field in the SubmittedOrder
            await submittedOrder.update({ RFI: true }, { where: { orderId: rfi.orderId } });
        }
    }
}
const approveQuantity = async (rfiId, quantityApproved, scenario, substitute = null) => {
    let quantityToApprove = quantityApproved;
    let substituteUsed = false;

    if (scenario === 'diplomatic') {
        quantityToApprove = Math.floor(quantityApproved * 0.2);
        substituteUsed = true;
    } else if (scenario === 'customize' && substitute) {
        quantityToApprove = substitute.quantity;
        substituteUsed = true;
    }

    await RFI.update({ isApproved: true, quantityApproved: quantityToApprove }, { where: { rfiId } });
    const rfi = await RFI.findOne({ where: { rfiId } });

    if (rfi) {
        // Update the Result field in the SubmittedOrder
        const [updatedRows] = await submittedOrder.update({ Result: true }, { where: { orderId: rfi.orderId } });
        console.log(`Updated ${updatedRows} rows in SubmittedOrder`);
    }

    if (substituteUsed) {
        // Create a PI with the substitute
        await PI.create({ rfiId, substituteId: substitute.id });
    } else {
        await PI.create({ rfiId });
    }

}
const getApprovedRFIs = async () => {
    const approvedRFIs = await RFI.findAll({
        where: {
            isApproved: true
        },
        attributes: ['rfiId', 'quantityApproved', 'scenario']
    });

    return approvedRFIs;
}


module.exports = { editRfi, approveQuantity,getApprovedRFIs };