const shipmentService = require('../services/shipmentService');

const submitShipment = async (req, res) => {
    const { id } = req.params;
    const { expectedDateOfArrival, borderCrossing, invoiceNumber, invoiceDate, invoiceAmount, invoiceAttachedFile, barcode2D, gtinNb, numberOfLots, batchNum, prodDate, expDate, snLotNum } = req.body;
    await shipmentService.submitShipment(id, expectedDateOfArrival, borderCrossing, invoiceNumber, invoiceDate, invoiceAmount, invoiceAttachedFile, barcode2D, gtinNb, numberOfLots, batchNum, prodDate, expDate, snLotNum);
    res.send({ message: 'Shipment submitted successfully' });
}

module.exports = { submitShipment };