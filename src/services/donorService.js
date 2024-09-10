const Donor = require('../models/donor');
const userAccounts = require('../models/userAccounts');
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

const editDonor = async (DonorId, donorData) => {
    try {
        const donor = await Donor.update(donorData, {
            where: { DonorId: DonorId }
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

const getDonorByUsername = async (username) => {
    try {
        const donor = await Donor.findOne({ where: { DonorName: username } });
        if (!donor) {
            throw new Error('Donor not found');
        }
        return donor;
    } catch (error) {
        console.error(error);
        throw new Error('Error in donorService: ' + error.message);
    }
};
const getIsActiveByDonorId = async (donorId) => {
    try {
        const userAccount = await userAccounts.findOne({
            where: { DonorId: donorId },
            attributes: ['isActive']
        });

        if (userAccount) {
            return userAccount.isActive;
        } else {
            throw new Error('UserAccount not found');
        }
    } catch (error) {
        console.error('Error fetching isActive status:', error);
        throw error;
    }
};
const getDonorById = async (donorId) => {
    try {
        const donor = await Donor.findByPk(donorId); // Find donor by primary key (DonorId)
        if (!donor) {
            throw new Error('Donor not found');
        }
        return donor;
    } catch (error) {
        console.error('Error fetching donor by ID:', error);
        throw new Error('Error in getDonorById: ' + error.message);
    }
};
module.exports = { addDonor, getAllDonors, editDonor, deleteDonor, getDonorByUsername, getIsActiveByDonorId, getDonorById };
