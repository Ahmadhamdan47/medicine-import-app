// src/controllers/responsiblePartyMappingController.js
const responsiblePartyMappingService = require('../services/responsiblePartyMappingService');

/**
 * Get mapping of responsible parties to their countries
 */
const getResponsiblePartyCountryMapping = async (req, res) => {
    try {
        const mappings = await responsiblePartyMappingService.getResponsiblePartyCountryMapping();
        res.json({
            success: true,
            count: mappings.length,
            data: mappings
        });
    } catch (error) {
        console.error('Error in getResponsiblePartyCountryMapping controller:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

/**
 * Get statistics for responsible party-country combinations
 */
const getResponsiblePartyCountryStats = async (req, res) => {
    try {
        const stats = await responsiblePartyMappingService.getResponsiblePartyCountryStats();
        res.json({
            success: true,
            count: stats.length,
            data: stats
        });
    } catch (error) {
        console.error('Error in getResponsiblePartyCountryStats controller:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

/**
 * Get all countries for a specific responsible party
 */
const getCountriesForResponsibleParty = async (req, res) => {
    try {
        const { responsiblePartyName } = req.params;
        const countries = await responsiblePartyMappingService.getCountriesForResponsibleParty(responsiblePartyName);
        res.json(countries);
    } catch (error) {
        console.error('Error in getCountriesForResponsibleParty controller:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getResponsiblePartyCountryMapping,
    getResponsiblePartyCountryStats,
    getCountriesForResponsibleParty
};
