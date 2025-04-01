const touchService = require('../services/touchService');

exports.getAllTouchNumbers = async (req, res) => {
    try {
        const numbers = await touchService.getAllTouchNumbers();
        res.status(200).json(numbers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addTouchNumber = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        const newNumber = await touchService.addTouchNumber(phoneNumber);
        res.status(201).json(newNumber);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.setActiveTouchNumber = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedNumber = await touchService.setActiveTouchNumber(id);
        res.status(200).json(updatedNumber);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};