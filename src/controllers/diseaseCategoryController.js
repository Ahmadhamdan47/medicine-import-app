const diseaseCategoryService = require('../services/diseaseCategoryService');

const addDiseaseCategory = async (req, res) => {
    const diseaseCategoryData = req.body;
    const diseaseCategory = await diseaseCategoryService.addDiseaseCategory(diseaseCategoryData);
    res.json(diseaseCategory);
};

const getAllDiseaseCategories = async (req, res) => {
    const diseaseCategories = await diseaseCategoryService.getAllDiseaseCategories();
    res.json(diseaseCategories);
};

const getDiseaseCategoryById = async (req, res) => {
    const diseaseCategory = await diseaseCategoryService.getDiseaseCategoryById(req.params.id);
    res.json(diseaseCategory);
};

const updateDiseaseCategory = async (req, res) => {
    const diseaseCategoryData = req.body;
    const diseaseCategory = await diseaseCategoryService.updateDiseaseCategory(req.params.id, diseaseCategoryData);
    res.json(diseaseCategory);
};

const deleteDiseaseCategory = async (req, res) => {
    await diseaseCategoryService.deleteDiseaseCategory(req.params.id);
    res.json({ message: 'Disease category deleted successfully' });
};

module.exports = {
    addDiseaseCategory,
    getAllDiseaseCategories,
    getDiseaseCategoryById,
    updateDiseaseCategory,
    deleteDiseaseCategory
};