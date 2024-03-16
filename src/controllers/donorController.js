const donorService = require('../services/donorService');

const addDonor = async (req, res) => {
    const donorData = req.body;

    try {
        const newDonor = await donorService.addDonor(donorData);
        res.json(newDonor);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

module.exports = { addDonor };