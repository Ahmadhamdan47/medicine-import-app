const swiftService = require('../services/swiftService');

const submitSwift = async (req, res) => {
    const { id } = req.params;
    const { swiftNumber, date, amount, bankName, attachedFile } = req.body;
    await swiftService.submitSwift(id, swiftNumber, date, amount, bankName, attachedFile);
    res.send({ message: 'Swift submitted successfully' });
}

module.exports = { submitSwift };