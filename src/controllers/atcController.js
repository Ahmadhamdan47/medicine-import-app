// src/controllers/ATCController.js

const ATCService = require('../services/atcService');

const getATCByDrugID = async (req, res) => {
    try {
        const atcCode = await ATCService.getATCByDrugID(req.params.drugID);
        res.json(atcCode);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getATCByDrugID
};