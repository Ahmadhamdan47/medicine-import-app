const recipientService = require('../services/recipientService');

const addRecipient = async (req, res) => {
    const recipientData = req.body;

    try {
        const newRecipient = await recipientService.addRecipient(recipientData);
        res.json(newRecipient);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

module.exports = { addRecipient };