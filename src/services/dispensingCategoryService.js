const DispensingCategory = require('../models/dispensingCategories');

const addDispensingCategory = async (dispensingCategoryData) => {
    try {
        const dispensingCategory = await DispensingCategory.create(dispensingCategoryData);
        return dispensingCategory;
    } catch (error) {
        console.error(error);
        throw new Error('Error in dispensingCategoryService: ' + error.message);
    }
};

const getDispensingCategoryById = async (DispensingCategoryId) => {
    try {
        const dispensingCategory = await DispensingCategory.findByPk(DispensingCategoryId);
        return dispensingCategory;
    } catch (error) {
        console.error(error);
        throw new Error('Error in dispensingCategoryService: ' + error.message);
    }
};

const getAllDispensingCategories = async () => {
    try {
        const dispensingCategories = await DispensingCategory.findAll();
        return dispensingCategories;
    } catch (error) {
        console.error(error);
        throw new Error('Error in dispensingCategoryService: ' + error.message);
    }
};

const editDispensingCategory = async (DispensingCategoryId, dispensingCategoryData) => {
    try {
        const dispensingCategory = await DispensingCategory.update(dispensingCategoryData, {
            where: { DispensingCategoryId: DispensingCategoryId }
        });
        return dispensingCategory;
    } catch (error) {
        console.error(error);
        throw new Error('Error in dispensingCategoryService: ' + error.message);
    }
};

const deleteDispensingCategory = async (DispensingCategoryId) => {
    try {
        await DispensingCategory.destroy({
            where: { DispensingCategoryId: DispensingCategoryId }
        });
    } catch (error) {
        console.error(error);
        throw new Error('Error in dispensingCategoryService: ' + error.message);
    }
};

module.exports = { addDispensingCategory, getDispensingCategoryById, getAllDispensingCategories, editDispensingCategory, deleteDispensingCategory };