const DosageOption = require('../models/dosageOption');
const { Op } = require('sequelize');

const addDosageOption = async (dosageOptionData) => {
    try {
        const dosageOption = await DosageOption.create(dosageOptionData);
        return dosageOption;
    } catch (error) {
        console.error(error);
        throw new Error('Error in dosageOptionService: ' + error.message);
    }
};

const getDosageOptionById = async (DosageOptionId) => {
    try {
        const dosageOption = await DosageOption.findByPk(DosageOptionId);
        return dosageOption;
    } catch (error) {
        console.error(error);
        throw new Error('Error in dosageOptionService: ' + error.message);
    }
};

const getAllDosageOptions = async () => {
    try {
        const dosageOptions = await DosageOption.findAll({
            order: [['DosageFormClean', 'ASC']]
        });
        return dosageOptions;
    } catch (error) {
        console.error(error);
        throw new Error('Error in dosageOptionService: ' + error.message);
    }
};

const searchDosageOptions = async (searchTerm) => {
    try {
        const dosageOptions = await DosageOption.findAll({
            where: {
                [Op.or]: [
                    { DosageFormClean: { [Op.like]: `%${searchTerm}%` } },
                    { PhysicalState: { [Op.like]: `%${searchTerm}%` } },
                    { SubstitutionRelationship: { [Op.like]: `%${searchTerm}%` } }
                ]
            },
            order: [['DosageFormClean', 'ASC']]
        });
        return dosageOptions;
    } catch (error) {
        console.error(error);
        throw new Error('Error in dosageOptionService: ' + error.message);
    }
};

const editDosageOption = async (DosageOptionId, dosageOptionData) => {
    try {
        const dosageOption = await DosageOption.update(dosageOptionData, {
            where: { DosageOptionId: DosageOptionId }
        });
        return dosageOption;
    } catch (error) {
        console.error(error);
        throw new Error('Error in dosageOptionService: ' + error.message);
    }
};

const deleteDosageOption = async (DosageOptionId) => {
    try {
        await DosageOption.destroy({
            where: { DosageOptionId: DosageOptionId }
        });
    } catch (error) {
        console.error(error);
        throw new Error('Error in dosageOptionService: ' + error.message);
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
