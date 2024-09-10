const Recipient = require('../models/recipient');

const addRecipient = async (recipientData) => {
    try {
        const newRecipient = await Recipient.create(recipientData);
        return newRecipient;
    } catch (error) {
        console.error(error);
        throw new Error('Error in recipientService: ' + error.message);
    }
};

const getAllRecipients = async () => {
    try {
        const recipients = await Recipient.findAll();
        return recipients;
    } catch (error) {
        console.error(error);
        throw new Error('Error in recipientService: ' + error.message);
    }
};

const editRecipient = async (recipientId, recipientData) => {
    try {
        const recipient = await Recipient.update(recipientData, {
            where: { id: recipientId }
        });
        return recipient;
    } catch (error) {
        console.error(error);
        throw new Error('Error in recipientService: ' + error.message);
    }
};

const deleteRecipient = async (recipientId) => {
    try {
        await Recipient.destroy({
            where: { id: recipientId }
        });
    } catch (error) {
        console.error(error);
        throw new Error('Error in recipientService: ' + error.message);
    }
};
const getRecipientById = async (recipientId) => {
    try {
        const recipient = await Recipient.findByPk(recipientId);
        if (!recipient) {
            throw new Error('Recipient not found');
        }
        return recipient;
    } catch (error) {
        console.error('Error fetching recipient by ID:', error);
        throw new Error('Error in getRecipientById: ' + error.message);
    }
};
module.exports = { addRecipient, getAllRecipients, editRecipient, deleteRecipient,getRecipientById };