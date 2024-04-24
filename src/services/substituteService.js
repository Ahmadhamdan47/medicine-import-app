const Substitute = require('../models/substitute');

const addSubstitute = async (drugId, substituteId) => {
    if (drugId === substituteId) {
        console.log("A drug cannot be a substitute for itself. Skipping...");
        return;
    }

    try {
        const substitute = await Substitute.create({
            Drug: drugId,
            Substitute: substituteId
        });

        return substitute;
    } catch (error) {
        console.error(error);
        throw new Error('Error in drugService: ' + error.message);
    }
};
const getSubstituteById = async (id) => {
    try {
        const substitute = await Substitute.findByPk(id);
        return substitute;
    } catch (error) {
        console.error(error);
        throw new Error('Error in substituteService: ' + error.message);
    }
};

const getAllSubstitutes = async () => {
    try {
        const substitutes = await Substitute.findAll();
        return substitutes;
    } catch (error) {
        console.error(error);
        throw new Error('Error in substituteService: ' + error.message);
    }
};

const updateSubstitute = async (id, drugId, substituteId) => {
    try {
        const substitute = await Substitute.findByPk(id);
        if (!substitute) {
            throw new Error('Substitute not found');
        }

        substitute.Drug = drugId;
        substitute.Substitute = substituteId;
        await substitute.save();

        return substitute;
    } catch (error) {
        console.error(error);
        throw new Error('Error in substituteService: ' + error.message);
    }
};

const deleteSubstitute = async (id) => {
    try {
        const substitute = await Substitute.findByPk(id);
        if (!substitute) {
            throw new Error('Substitute not found');
        }

        await substitute.destroy();
    } catch (error) {
        console.error(error);
        throw new Error('Error in substituteService: ' + error.message);
    }
};

module.exports = {
    // ...other exports...
    addSubstitute,
    getSubstituteById,
    getAllSubstitutes,
    updateSubstitute,
    deleteSubstitute,
};
