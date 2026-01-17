// src/services/responsiblePartyMappingService.js
const sequelize = require('../../config/databasePharmacy');
const { Op } = require('sequelize');
const Drug = require('../models/drug');

/**
 * Get a mapping of responsible parties to their countries based on drug table data
 * Returns unique responsible party and country combinations
 */
const getResponsiblePartyCountryMapping = async () => {
    try {
        // Query distinct responsible parties and their countries from the drug table
        const mappings = await Drug.findAll({
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('ResponsibleParty')), 'ResponsibleParty'],
                'ResponsiblePartyCountry'
            ],
            where: {
                ResponsibleParty: {
                    [Op.ne]: null,
                    [Op.ne]: ''
                }
            },
            order: [
                ['ResponsibleParty', 'ASC']
            ],
            raw: true
        });

        // Group by responsible party to handle cases where a party might have multiple countries
        const groupedMappings = {};
        mappings.forEach(item => {
            const party = item.ResponsibleParty;
            const country = item.ResponsiblePartyCountry || 'Unknown';
            
            if (!groupedMappings[party]) {
                groupedMappings[party] = {
                    responsibleParty: party,
                    countries: []
                };
            }
            
            if (!groupedMappings[party].countries.includes(country)) {
                groupedMappings[party].countries.push(country);
            }
        });

        // Convert to array format
        const result = Object.values(groupedMappings).map(item => ({
            responsibleParty: item.responsibleParty,
            countries: item.countries,
            primaryCountry: item.countries[0] // First country as primary
        }));

        return result;
    } catch (error) {
        console.error('Error in getResponsiblePartyCountryMapping:', error);
        throw new Error('Error fetching responsible party country mapping: ' + error.message);
    }
};

/**
 * Get drugs count for each responsible party-country combination
 */
const getResponsiblePartyCountryStats = async () => {
    try {
        const stats = await Drug.findAll({
            attributes: [
                'ResponsibleParty',
                'ResponsiblePartyCountry',
                [sequelize.fn('COUNT', sequelize.col('DrugID')), 'drugCount']
            ],
            where: {
                ResponsibleParty: {
                    [Op.ne]: null,
                    [Op.ne]: ''
                }
            },
            group: ['ResponsibleParty', 'ResponsiblePartyCountry'],
            order: [[sequelize.fn('COUNT', sequelize.col('DrugID')), 'DESC']],
            raw: true
        });

        return stats;
    } catch (error) {
        console.error('Error in getResponsiblePartyCountryStats:', error);
        throw new Error('Error fetching responsible party country statistics: ' + error.message);
    }
};

/**
 * Get all countries for a specific responsible party
 */
const getCountriesForResponsibleParty = async (responsiblePartyName) => {
    try {
        const results = await Drug.findAll({
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('ResponsiblePartyCountry')), 'ResponsiblePartyCountry']
            ],
            where: {
                ResponsibleParty: responsiblePartyName
            },
            order: [['ResponsiblePartyCountry', 'ASC']],
            raw: true
        });

        return results.map(r => r.ResponsiblePartyCountry);
    } catch (error) {
        console.error('Error in getCountriesForResponsibleParty:', error);
        throw new Error('Error fetching countries for responsible party: ' + error.message);
    }
};

module.exports = {
    getResponsiblePartyCountryMapping,
    getResponsiblePartyCountryStats,
    getCountriesForResponsibleParty
};
