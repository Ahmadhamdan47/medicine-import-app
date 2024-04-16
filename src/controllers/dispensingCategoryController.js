const dispensingCategoryService = require('../services/dispensingCategoryService');

const addDispensingCategory = async (req, res) => {
    try {
        const dispensingCategory = await dispensingCategoryService.addDispensingCategory(req.body);
        res.json(dispensingCategory);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getDispensingCategoryById = async (req, res) => {
    try {
        const dispensingCategory = await dispensingCategoryService.getDispensingCategoryById(req.params.DispensingCategoryId);
        res.json(dispensingCategory);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getAllDispensingCategories = async (req, res) => {
    try {
        const dispensingCategories = await dispensingCategoryService.getAllDispensingCategories();
        res.json(dispensingCategories);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const editDispensingCategory = async (req, res) => {
    try {
        const dispensingCategory = await dispensingCategoryService.editDispensingCategory(req.params.DispensingCategoryId, req.body);
        res.json(dispensingCategory);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const deleteDispensingCategory = async (req, res) => {
    try {
        await dispensingCategoryService.deleteDispensingCategory(req.params.DispensingCategoryId);
        res.json({ message: 'Dispensing Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

module.exports = { addDispensingCategory, getDispensingCategoryById, getAllDispensingCategories, editDispensingCategory, deleteDispensingCategory };