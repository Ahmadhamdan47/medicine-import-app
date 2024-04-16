const City = require('../models/city');

const addCity = async (cityData) => {
    try {
        const city = await City.create(cityData);
        return city;
    } catch (error) {
        console.error(error);
        throw new Error('Error in cityService: ' + error.message);
    }
};

const getCityById = async (CityId) => {
    try {
        const city = await City.findByPk(CityId);
        return city;
    } catch (error) {
        console.error(error);
        throw new Error('Error in cityService: ' + error.message);
    }
};

const getAllCities = async () => {
    try {
        const cities = await City.findAll();
        return cities;
    } catch (error) {
        console.error(error);
        throw new Error('Error in cityService: ' + error.message);
    }
};

const editCity = async (CityId, cityData) => {
    try {
        const city = await City.update(cityData, {
            where: { CityId: CityId }
        });
        return city;
    } catch (error) {
        console.error(error);
        throw new Error('Error in cityService: ' + error.message);
    }
};

const deleteCity = async (CityId) => {
    try {
        await City.destroy({
            where: { CityId: CityId }
        });
    } catch (error) {
        console.error(error);
        throw new Error('Error in cityService: ' + error.message);
    }
};

module.exports = { addCity, getCityById, getAllCities, editCity, deleteCity };