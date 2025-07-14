const mobileDonationService = require('../services/mobileDonationService');

exports.getMobileDonationStatus = async (req, res) => {
    try {
        const status = await mobileDonationService.getMobileDonationStatus();
        res.status(200).json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
