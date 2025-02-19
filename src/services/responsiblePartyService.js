// src/services/responsiblePartyService.js
const ResponsibleParty = require('../models/responsibleParty');

const addResponsibleParty = async (responsiblePartyData) => {
    try {
        const responsibleParty = await ResponsibleParty.create(responsiblePartyData);
        return responsibleParty;
    } catch (error) {
        console.error(error);
        throw new Error('Error in responsiblePartyService: ' + error.message);
    }
};

const getResponsiblePartyById = async (ResponsiblePartyId) => {
    try {
        const responsibleParty = await ResponsibleParty.findByPk(ResponsiblePartyId);
        return responsibleParty;
    } catch (error) {
        console.error(error);
        throw new Error('Error in responsiblePartyService: ' + error.message);
    }
};

const getAllResponsibleParties = async () => {
    try {
        const responsibleParties = await ResponsibleParty.findAll();
        return responsibleParties;
    } catch (error) {
        console.error(error);
        throw new Error('Error in responsiblePartyService: ' + error.message);
    }
};

const editResponsibleParty = async (ResponsiblePartyId, responsiblePartyData) => {
    try {
        const responsibleParty = await ResponsibleParty.update(responsiblePartyData, {
            where: { ResponsiblePartyId }
        });
        return responsibleParty;
    } catch (error) {
        console.error(error);
        throw new Error('Error in responsiblePartyService: ' + error.message);
    }
};

const deleteResponsibleParty = async (ResponsiblePartyId) => {
    try {
        const responsibleParty = await ResponsibleParty.destroy({
            where: { ResponsiblePartyId }
        });
        return responsibleParty;
    } catch (error) {
        console.error(error);
        throw new Error('Error in responsiblePartyService: ' + error.message);
    }
};

module.exports = {
    addResponsibleParty,
    getResponsiblePartyById,
    getAllResponsibleParties,
    editResponsibleParty,
    deleteResponsibleParty
};