const Donor = require('../models/Donor');

const addDonor = async (donorData) => {
    try {
        const newDonor = await Donor.create(donorData);
        return newDonor;
    } catch (error) {
        console.error(error);
        throw new Error('Error in donorService: ' + error.message);
    }
};

const getAllDonors = async () => {
    try {
        const donors = await Donor.findAll();
        return donors;
    } catch (error) {
        console.error(error);
        throw new Error('Error in donorService: ' + error.message);
    }
};

module.exports = { addDonor, getAllDonors };
