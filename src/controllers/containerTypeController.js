const containerTypeService = require('../services/containerTypeService');

const addContainerType = async (req, res) => {
    try {
        const containerType = await containerTypeService.addContainerType(req.body);
        res.json(containerType);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getContainerTypeById = async (req, res) => {
    try {
        const containerType = await containerTypeService.getContainerTypeById(req.params.ContainerTypeId);
        res.json(containerType);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getAllContainerTypes = async (req, res) => {
    try {
        const containerTypes = await containerTypeService.getAllContainerTypes();
        res.json(containerTypes);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const editContainerType = async (req, res) => {
    try {
        const containerType = await containerTypeService.editContainerType(req.params.ContainerTypeId, req.body);
        res.json(containerType);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const deleteContainerType = async (req, res) => {
    try {
        await containerTypeService.deleteContainerType(req.params.ContainerTypeId);
        res.json({ message: 'Container Type deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

module.exports = { addContainerType, getContainerTypeById, getAllContainerTypes, editContainerType, deleteContainerType };