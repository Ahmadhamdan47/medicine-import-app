const Substitute = require('../models/substitute');

const addSubstitute = async (drugId, substituteId) => {
    try {
        const substitute = await Substitute.create({
            Drug: drugId,
            Substitute: substituteId
        });

        return substitute;
    } catch (error) {
        console.error(error);
        throw new Error('Error in drugService: ' + error.message);
    }
};

module.exports = {
    // ...other exports...
    addSubstitute,
};