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

const approveQuantity = async (rfiId, quantityApproved) => {
    await RFI.update({ isApproved: true, quantityApproved }, { where: { rfiId } });
    const rfi = await RFI.findOne({ where: { rfiId } });
   
    if (rfi) {
        // Update the Result field in the SubmittedOrder
        const [updatedRows] = await submittedOrder.update({ Result: true }, { where: { orderId: rfi.orderId } });
        console.log(`Updated ${updatedRows} rows in SubmittedOrder`);
    }
    await PI.create({ rfiId });


}

module.exports = { editRfi, approveQuantity };