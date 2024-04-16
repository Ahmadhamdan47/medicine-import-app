const ContainerType = require('../models/containerType');

const addContainerType = async (containerTypeData) => {
    try {
        const containerType = await ContainerType.create(containerTypeData);
        return containerType;
    } catch (error) {
        console.error(error);
        throw new Error('Error in containerTypeService: ' + error.message);
    }
};

const getContainerTypeById = async (ContainerTypeId) => {
    try {
        const containerType = await ContainerType.findByPk(ContainerTypeId);
        return containerType;
    } catch (error) {
        console.error(error);
        throw new Error('Error in containerTypeService: ' + error.message);
    }
};

const getAllContainerTypes = async () => {
    try {
        const containerTypes = await ContainerType.findAll();
        return containerTypes;
    } catch (error) {
        console.error(error);
        throw new Error('Error in containerTypeService: ' + error.message);
    }
};

const editContainerType = async (ContainerTypeId, containerTypeData) => {
    try {
        const containerType = await ContainerType.update(containerTypeData, {
            where: { ContainerTypeId: ContainerTypeId }
        });
        return containerType;
    } catch (error) {
        console.error(error);
        throw new Error('Error in containerTypeService: ' + error.message);
    }
};

const deleteContainerType = async (ContainerTypeId) => {
    try {
        await ContainerType.destroy({
            where: { ContainerTypeId: ContainerTypeId }
        });
    } catch (error) {
        console.error(error);
        throw new Error('Error in containerTypeService: ' + error.message);
    }
};

module.exports = { addContainerType, getContainerTypeById, getAllContainerTypes, editContainerType, deleteContainerType };