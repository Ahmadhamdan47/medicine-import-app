const recipientService = require('../services/recipientService');

const addRecipient = async (req, res) => {
    const recipientData = req.body;

    try {
        const newRecipient = await recipientService.addRecipient(recipientData);
        res.status(201).json(newRecipient);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getAllRecipients = async (req, res) => {
    try {
        const recipients = await recipientService.getAllRecipients();
        res.json(recipients);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

module.exports = { addRecipient, getAllRecipients };
