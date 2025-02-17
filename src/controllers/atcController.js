// src/controllers/atcController.js

const ATCService = require('../services/atcService');

const getATCByDrugID = async (req, res) => {
    try {
        const atcCode = await ATCService.getATCByDrugID(req.params.DrugID);
        res.json(atcCode);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addATCMapping = async (req, res) => {
    try {
        const mapping = await ATCService.addATCMapping(req.body.Code, req.body.DrugName);
        res.json(mapping);
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
const getATCById = async (req, res) => {
    try {
      const atcId = req.params.id;
      const atcCode = await atcService.getATCById(atcId);
      res.status(200).json(atcCode);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
    getATCByDrugID,
    addATC,
    editATC,
    deleteATC,
    getAllATC,
    addATCMapping,
    getATCById,

};