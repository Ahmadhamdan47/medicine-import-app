const Shipment = require('../models/shipment');
const RFD = require('../models/rfd');
const SubmittedOrder = require('../models/submittedOrder');
const RFI = require('../models/rfi');

const submitShipment = async (id, expectedDateOfArrival, borderCrossing, invoiceNumber, invoiceDate, invoiceAmount, invoiceAttachedFile, barcode2D, gtinNb, numberOfLots, batchNum, prodDate, expDate, snLotNum) => {
    await Shipment.update({ expectedDateOfArrival, borderCrossing, invoiceNumber, invoiceDate, invoiceAmount, invoiceAttachedFile, barcode2D, gtinNb, numberOfLots, batchNum, prodDate, expDate, snLotNum }, { where: { id } });

    const shipment = await Shipment.findOne({ where: { id } });
    if (shipment) {
        await RFD.create({ rfiId: shipment.rfiId, isReceived: 'false' });
        // After creating the RFD, get the orderId from the RFI
        const rfi = await RFI.findOne({ where: { rfiId: shipment.rfiId } });
        if (rfi) {
            // Update the Invoice field in the SubmittedOrder
            await SubmittedOrder.update({ invoice: true }, { where: { orderId: rfi.orderId } });
        }
    }
}

module.exports = { submitShipment };