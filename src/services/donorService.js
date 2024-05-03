const Donor = require('../models/donor');

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

const editDonor = async (donorId, donorData) => {
    try {
        const donor = await Donor.update(donorData, {
            where: { id: donorId }
        });
        return donor;
    } catch (error) {
        console.error(error);
        throw new Error('Error in donorService: ' + error.message);
    }
};

const deleteDonor = async (donorId) => {
    try {
        await Donor.destroy({
            where: { id: donorId }
        });
    } catch (error) {
        console.error(error);
        throw new Error('Error in donorService: ' + error.message);
    }
};

module.exports = { addDonor, getAllDonors, editDonor, deleteDonor };