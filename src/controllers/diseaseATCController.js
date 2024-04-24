const diseaseATCService = require('../services/diseaseATCService');

const addDiseaseCategoryATC = async (req, res, next) => {
    try {
        const diseaseCategoryAtc = await diseaseATCService.addDiseaseCategoryATC(req.body);
        res.json(diseaseCategoryAtc);
    } catch (err) {
        next(err);
    }
};

const getAllDiseaseCategoryATCs = async (req, res, next) => {
    try {
        const diseaseCategoryAtcs = await diseaseATCService.getAllDiseaseCategoryATCs();
        res.json(diseaseCategoryAtcs);
    } catch (err) {
        next(err);
    }
};

const getDiseaseCategoryATCById = async (req, res, next) => {
    try {
        const diseaseCategoryAtc = await diseaseATCService.getDiseaseCategoryATCById(req.params.id);
        res.json(diseaseCategoryAtc);
    } catch (err) {
        next(err);
    }
};

const updateDiseaseCategoryATC = async (req, res, next) => {
    try {
        const diseaseCategoryAtc = await diseaseATCService.updateDiseaseCategoryATC(req.params.id, req.body);
        res.json(diseaseCategoryAtc);
    } catch (err) {
        next(err);
    }
};

const deleteDiseaseCategoryATC = async (req, res, next) => {
    try {
        await diseaseATCService.deleteDiseaseCategoryATC(req.params.id);
        res.json({ message: 'DiseaseCategoryATC deleted successfully' });
    } catch (err) {
        next(err);
    }
};
const getDiseaseByDrugName = async (req, res) => {
    try {
        const diseases = await diseaseATCService.getDiseaseByDrugName(req.params.drugName);
        res.json(diseases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getDrugsByDiseaseCategoryName = async (req, res) => {
    try {
        const drugs = await diseaseATCService.getDrugsByDiseaseCategoryName(req.params.diseaseCategoryName);
        res.json(drugs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
    addDiseaseCategoryATC,
    getAllDiseaseCategoryATCs,
    getDiseaseCategoryATCById,
    updateDiseaseCategoryATC,
    deleteDiseaseCategoryATC,
    getDiseaseByDrugName,
    getDrugsByDiseaseCategoryName
};