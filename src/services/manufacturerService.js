// src/services/manufacturerService.js
const Manufacturer = require('../models/manufacturer');

const addManufacturer = async (manufacturerData) => {
    try {
        const manufacturer = await Manufacturer.create(manufacturerData);
        return manufacturer;
    } catch (error) {
        console.error(error);
        throw new Error('Error in manufacturerService: ' + error.message);
    }
};

const getManufacturerById = async (ManufacturerId) => {
    try {
        const manufacturer = await Manufacturer.findByPk(ManufacturerId);
        return manufacturer;
    } catch (error) {
        console.error(error);
        throw new Error('Error in manufacturerService: ' + error.message);
    }
};

const getAllManufacturers = async () => {
    try {
        const manufacturers = await Manufacturer.findAll();
        return manufacturers;
    } catch (error) {
        console.error(error);
        throw new Error('Error in manufacturerService: ' + error.message);
    }
};

const editManufacturer = async (ManufacturerId, manufacturerData) => {
    try {
        const manufacturer = await Manufacturer.update(manufacturerData, {
            where: { ManufacturerId }
        });
        return manufacturer;
    } catch (error) {
        console.error(error);
        throw new Error('Error in manufacturerService: ' + error.message);
    }
};

const deleteManufacturer = async (ManufacturerId) => {
    try {
        const manufacturer = await Manufacturer.destroy({
            where: { ManufacturerId }
        });
        return manufacturer;
    } catch (error) {
        console.error(error);
        throw new Error('Error in manufacturerService: ' + error.message);
    }
};

module.exports = {
    addManufacturer,
    getManufacturerById,
    getAllManufacturers,
    editManufacturer,
    deleteManufacturer
};