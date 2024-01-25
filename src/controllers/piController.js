const piService = require('../services/piService');

const submitPI = async (req, res) => {
    const { id } = req.params;
    const { invoiceNumber, date, amount, attachedFile } = req.body;
    await piService.submitPI(id, invoiceNumber, date, amount, attachedFile);
    res.send({ message: 'PI submitted successfully' });
}

module.exports = { submitPI };