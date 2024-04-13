const DiseaseCategory = require('../models/diseaseCategory');

const addDiseaseCategory = async (diseaseCategoryData) => {
    const diseaseCategory = await DiseaseCategory.create(diseaseCategoryData);
    return diseaseCategory;
};

const getAllDiseaseCategories = async () => {
    const diseaseCategories = await DiseaseCategory.findAll();
    return diseaseCategories;
};

const getDiseaseCategoryById = async (id) => {
    const diseaseCategory = await DiseaseCategory.findByPk(id);
    return diseaseCategory;
};

const updateDiseaseCategory = async (id, diseaseCategoryData) => {
    const diseaseCategory = await DiseaseCategory.update(diseaseCategoryData, {
        where: { DiseaseCategoryId: id }
    });
    return diseaseCategory;
};

const deleteDiseaseCategory = async (id) => {
    const diseaseCategory = await DiseaseCategory.destroy({
        where: { DiseaseCategoryId: id }
    });
    return diseaseCategory;
};

module.exports = {
    addDiseaseCategory,
    getAllDiseaseCategories,
    getDiseaseCategoryById,
    updateDiseaseCategory,
    deleteDiseaseCategory
};