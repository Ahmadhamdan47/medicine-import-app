const routeOptionService = require('../services/routeOptionService');

const addRouteOption = async (req, res) => {
    try {
        const routeOption = await routeOptionService.addRouteOption(req.body);
        res.json(routeOption);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getRouteOptionById = async (req, res) => {
    try {
        const routeOption = await routeOptionService.getRouteOptionById(req.params.RouteOptionId);
        if (!routeOption) {
            return res.status(404).json({ message: 'Route option not found' });
        }
        res.json(routeOption);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getAllRouteOptions = async (req, res) => {
    try {
        const routeOptions = await routeOptionService.getAllRouteOptions();
        res.json(routeOptions);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const searchRouteOptions = async (req, res) => {
    try {
        const { search } = req.query;
        if (!search) {
            return res.status(400).json({ message: 'Search term is required' });
        }
        const routeOptions = await routeOptionService.searchRouteOptions(search);
        res.json(routeOptions);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const editRouteOption = async (req, res) => {
    try {
        const routeOption = await routeOptionService.editRouteOption(req.params.RouteOptionId, req.body);
        res.json(routeOption);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const deleteRouteOption = async (req, res) => {
    try {
        await routeOptionService.deleteRouteOption(req.params.RouteOptionId);
        res.json({ message: 'Route option deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
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
