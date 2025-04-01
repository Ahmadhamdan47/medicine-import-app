const alfaService = require('../services/alfaService');

exports.getAllAlfaNumbers = async (req, res) => {
    try {
        const numbers = await alfaService.getAllAlfaNumbers();
        res.status(200).json(numbers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addAlfaNumber = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        const newNumber = await alfaService.addAlfaNumber(phoneNumber);
        res.status(201).json(newNumber);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.setActiveAlfaNumber = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedNumber = await alfaService.setActiveAlfaNumber(id);
        res.status(200).json(updatedNumber);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};