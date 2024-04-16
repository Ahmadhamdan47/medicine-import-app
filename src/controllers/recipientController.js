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

const editRecipient = async (req, res) => {
    try {
        const recipient = await recipientService.editRecipient(req.params.recipientId, req.body);
        res.json(recipient);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const deleteRecipient = async (req, res) => {
    try {
        await recipientService.deleteRecipient(req.params.recipientId);
        res.json({ message: 'Recipient deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

module.exports = { addRecipient, getAllRecipients, editRecipient, deleteRecipient };