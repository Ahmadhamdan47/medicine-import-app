const cityService = require('../services/cityService');

const addCity = async (req, res) => {
    try {
        const city = await cityService.addCity(req.body);
        res.json(city);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getCityById = async (req, res) => {
    try {
        const city = await cityService.getCityById(req.params.CityId);
        res.json(city);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getAllCities = async (req, res) => {
    try {
        const cities = await cityService.getAllCities();
        res.json(cities);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const editCity = async (req, res) => {
    try {
        const city = await cityService.editCity(req.params.CityId, req.body);
        res.json(city);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const deleteCity = async (req, res) => {
    try {
        await cityService.deleteCity(req.params.CityId);
        res.json({ message: 'City deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

module.exports = { addCity, getCityById, getAllCities, editCity, deleteCity };