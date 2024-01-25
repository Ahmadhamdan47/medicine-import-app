const rfiService = require('../services/rfiService');

const editRfi = async (req, res) => {
    const { id } = req.params; // get id from URL parameters
    const { offerType, offerInput, notes } = req.body;
    await rfiService.editRfi(id, offerType, offerInput, notes);
    res.send({ message: 'RFI updated successfully' });
}

const approveQuantity = async (req, res) => {
    const { id } = req.params; // get id from URL parameters
    const { quantityApproved } = req.body;
    await rfiService.approveQuantity(id, quantityApproved);
    res.send({ message: 'Quantity approved successfully' });
}

module.exports = { editRfi, approveQuantity };