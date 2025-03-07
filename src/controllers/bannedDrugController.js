const BannedDrugsService = require('../services/bannedDrugsService');

class BannedDrugsController {
    static add(req, res) {
        try {
            const criteria = req.body;
            const bannedDrug = BannedDrugsService.addBannedDrug(criteria);
            res.status(201).json({ success: true, data: bannedDrug });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    static getAll(req, res) {
        try {
            const bannedDrugs = BannedDrugsService.getBannedDrugs();
            res.status(200).json({ success: true, data: bannedDrugs });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    static remove(req, res) {
        try {
            const { cisId } = req.params;
            BannedDrugsService.removeBannedDrug(cisId);
            res.status(200).json({ success: true, message: 'Banned drug removed successfully' });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

module.exports = BannedDrugsController;