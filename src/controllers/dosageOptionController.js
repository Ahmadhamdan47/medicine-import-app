const dosageOptionService = require('../services/dosageOptionService');

const addDosageOption = async (req, res) => {
    try {
        const dosageOption = await dosageOptionService.addDosageOption(req.body);
        res.json(dosageOption);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getDosageOptionById = async (req, res) => {
    try {
        const dosageOption = await dosageOptionService.getDosageOptionById(req.params.DosageOptionId);
        if (!dosageOption) {
            return res.status(404).json({ message: 'Dosage option not found' });
        }
        res.json(dosageOption);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getAllDosageOptions = async (req, res) => {
    try {
        const dosageOptions = await dosageOptionService.getAllDosageOptions();
        res.json(dosageOptions);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const searchDosageOptions = async (req, res) => {
    try {
        const { search } = req.query;
        if (!search) {
            return res.status(400).json({ message: 'Search term is required' });
        }
        const dosageOptions = await dosageOptionService.searchDosageOptions(search);
        res.json(dosageOptions);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const editDosageOption = async (req, res) => {
    try {
        const dosageOption = await dosageOptionService.editDosageOption(req.params.DosageOptionId, req.body);
        res.json(dosageOption);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const deleteDosageOption = async (req, res) => {
    try {
        await dosageOptionService.deleteDosageOption(req.params.DosageOptionId);
        res.json({ message: 'Dosage option deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

module.exports = { 
    addDosageOption, 
    getDosageOptionById, 
    getAllDosageOptions, 
    searchDosageOptions,
    editDosageOption, 
    deleteDosageOption 
};
