const RouteOption = require('../models/routeOption');
const { Op } = require('sequelize');

const addRouteOption = async (routeOptionData) => {
    try {
        const routeOption = await RouteOption.create(routeOptionData);
        return routeOption;
    } catch (error) {
        console.error(error);
        throw new Error('Error in routeOptionService: ' + error.message);
    }
};

const getRouteOptionById = async (RouteOptionId) => {
    try {
        const routeOption = await RouteOption.findByPk(RouteOptionId);
        return routeOption;
    } catch (error) {
        console.error(error);
        throw new Error('Error in routeOptionService: ' + error.message);
    }
};

const getAllRouteOptions = async () => {
    try {
        const routeOptions = await RouteOption.findAll({
            order: [['Route', 'ASC']]
        });
        return routeOptions;
    } catch (error) {
        console.error(error);
        throw new Error('Error in routeOptionService: ' + error.message);
    }
};

const searchRouteOptions = async (searchTerm) => {
    try {
        const routeOptions = await RouteOption.findAll({
            where: {
                [Op.or]: [
                    { Acronym: { [Op.like]: `%${searchTerm}%` } },
                    { Route: { [Op.like]: `%${searchTerm}%` } },
                    { Category: { [Op.like]: `%${searchTerm}%` } }
                ]
            },
            order: [['Route', 'ASC']]
        });
        return routeOptions;
    } catch (error) {
        console.error(error);
        throw new Error('Error in routeOptionService: ' + error.message);
    }
};

const editRouteOption = async (RouteOptionId, routeOptionData) => {
    try {
        const routeOption = await RouteOption.update(routeOptionData, {
            where: { RouteOptionId: RouteOptionId }
        });
        return routeOption;
    } catch (error) {
        console.error(error);
        throw new Error('Error in routeOptionService: ' + error.message);
    }
};

const deleteRouteOption = async (RouteOptionId) => {
    try {
        await RouteOption.destroy({
            where: { RouteOptionId: RouteOptionId }
        });
    } catch (error) {
        console.error(error);
        throw new Error('Error in routeOptionService: ' + error.message);
    }
};

module.exports = { 
    addRouteOption, 
    getRouteOptionById, 
    getAllRouteOptions, 
    searchRouteOptions,
    editRouteOption, 
    deleteRouteOption 
};
