const donationService = require('../services/donationService');

const addDonation = async (req, res) => {
    const donationData = req.body;

    try {
        const newDonation = await donationService.createDonation(donationData);
        res.json(newDonation);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

module.exports = { addDonation };