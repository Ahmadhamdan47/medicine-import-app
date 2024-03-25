const donorService = require('../services/donorService');

const addDonor = async (req, res) => {
    const donorData = req.body;

    try {
        const newDonor = await donorService.addDonor(donorData);
        res.status(201).json(newDonor);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getAllDonors = async (req, res) => {
    try {
        const donors = await donorService.getAllDonors();
        res.json(donors);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

module.exports = { addDonor, getAllDonors };
