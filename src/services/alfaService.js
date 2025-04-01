const AlfaNumbers = require('../models/alfaNumbers');

const getAllAlfaNumbers = async () => {
    return await AlfaNumbers.findAll();
};

const addAlfaNumber = async (phoneNumber) => {
    return await AlfaNumbers.create({ phoneNumber });
};

const setActiveAlfaNumber = async (id) => {
    await AlfaNumbers.update({ isActive: false }, { where: {} }); // Deactivate all
    const updatedNumber = await AlfaNumbers.update({ isActive: true }, { where: { id } });
    if (!updatedNumber[0]) throw new Error('Alfa number not found');
    return updatedNumber;
};

module.exports = { getAllAlfaNumbers, addAlfaNumber, setActiveAlfaNumber };