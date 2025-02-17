// src/controllers/manufacturerController.js
const manufacturerService = require('../services/manufacturerService');

const addManufacturer = async (req, res) => {
    try {
        const manufacturer = await manufacturerService.addManufacturer(req.body);
        res.json(manufacturer);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getManufacturerById = async (req, res) => {
    try {
        const manufacturer = await manufacturerService.getManufacturerById(req.params.ManufacturerId);
        res.json(manufacturer);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getAllManufacturers = async (req, res) => {
    try {
        const manufacturers = await manufacturerService.getAllManufacturers();
        res.json(manufacturers);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const editManufacturer = async (req, res) => {
    try {
        const manufacturer = await manufacturerService.editManufacturer(req.params.ManufacturerId, req.body);
        res.json(manufacturer);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const deleteManufacturer = async (req, res) => {
    try {
        await manufacturerService.deleteManufacturer(req.params.ManufacturerId);
        res.json({ message: "Manufacturer deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

module.exports = {
    addManufacturer,
    getManufacturerById,
    getAllManufacturers,
    editManufacturer,
    deleteManufacturer
};