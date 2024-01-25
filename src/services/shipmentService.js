const Shipment = require('../models/shipment');

const submitShipment = async (id, expectedDateOfArrival, borderCrossing, invoiceNumber, invoiceDate, invoiceAmount, invoiceAttachedFile, barcode2D, gtinNb, numberOfLots, batchNum, prodDate, expDate, snLotNum) => {
    await Shipment.update({ expectedDateOfArrival, borderCrossing, invoiceNumber, invoiceDate, invoiceAmount, invoiceAttachedFile, barcode2D, gtinNb, numberOfLots, batchNum, prodDate, expDate, snLotNum }, { where: { id } });

    const shipment = await Shipment.findOne({ where: { id } });
    if (shipment) {
        await RFD.create({ rfiId: shipment.rfiId, isReceived: 'pending' });
    }
}

module.exports = { submitShipment };