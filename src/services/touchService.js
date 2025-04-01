const TouchNumbers = require('../models/touchNumbers');

const getAllTouchNumbers = async () => {
    return await TouchNumbers.findAll();
};

const addTouchNumber = async (phoneNumber) => {
    return await TouchNumbers.create({ phoneNumber });
};

const setActiveTouchNumber = async (id) => {
    await TouchNumbers.update({ isActive: false }, { where: {} }); // Deactivate all
    const updatedNumber = await TouchNumbers.update({ isActive: true }, { where: { id } });
    if (!updatedNumber[0]) throw new Error('Touch number not found');
    return updatedNumber;
};

module.exports = { getAllTouchNumbers, addTouchNumber, setActiveTouchNumber };