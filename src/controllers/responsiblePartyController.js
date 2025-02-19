// src/controllers/responsiblePartyController.js
const responsiblePartyService = require('../services/responsiblePartyService');

const addResponsibleParty = async (req, res) => {
    try {
        const responsibleParty = await responsiblePartyService.addResponsibleParty(req.body);
        res.json(responsibleParty);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getResponsiblePartyById = async (req, res) => {
    try {
        const responsibleParty = await responsiblePartyService.getResponsiblePartyById(req.params.ResponsiblePartyId);
        res.json(responsibleParty);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getAllResponsibleParties = async (req, res) => {
    try {
        const responsibleParties = await responsiblePartyService.getAllResponsibleParties();
        res.json(responsibleParties);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const editResponsibleParty = async (req, res) => {
    try {
        const responsibleParty = await responsiblePartyService.editResponsibleParty(req.params.ResponsiblePartyId, req.body);
        res.json(responsibleParty);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const deleteResponsibleParty = async (req, res) => {
    try {
        await responsiblePartyService.deleteResponsibleParty(req.params.ResponsiblePartyId);
        res.json({ message: "Responsible Party deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

module.exports = {
    addResponsibleParty,
    getResponsiblePartyById,
    getAllResponsibleParties,
    editResponsibleParty,
    deleteResponsibleParty
};