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
const addATC = async (req, res) => {
    try {
        const atcCode = await ATCService.addATC(req.body);
        res.json(atcCode);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const editATC = async (req, res) => {
    try {
        const atcCode = await ATCService.editATC(req.params.atcId, req.body);
        res.json(atcCode);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteATC = async (req, res) => {
    try {
        await ATCService.deleteATC(req.params.atcId);
        res.json({ message: 'ATC code deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const getAllATC = async (req, res) => {
    try {
        const allATC = await ATCService.getAllATC();
        res.json(allATC);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getATCByDrugID,
    addATC,
    editATC,
    deleteATC,
    getAllATC
};