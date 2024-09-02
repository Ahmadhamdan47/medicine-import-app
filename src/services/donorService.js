const Donor = require('../models/donor');
const UserAccounts = require('../models/userAccounts');
const sequelize = require("sequelize");

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
        // Use sequelize to include UserAccounts and get the IsActive field
        const donors = await Donor.findAll({
            include: [
                {
                    model: UserAccounts,
                    attributes: ['IsActive'],  // Select only the IsActive field from UserAccounts
                    where: {
                        DonorId: sequelize.col('Donor.DonorId')  // Join condition based on DonorId
                    },
                    required: false  // Set to false to include donors even if they don't have a UserAccount
                }
            ]
        });

        // Format the response to include IsActive field in the main object for easier access
        const formattedDonors = donors.map(donor => ({
            ...donor.dataValues,
            IsActive: donor.UserAccount ? donor.UserAccount.IsActive : null  // Include IsActive from UserAccount or null if not present
        }));

        return formattedDonors;
    } catch (error) {
        console.error('Error in donorService:', error);
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


module.exports = { addDonor, getAllDonors, editDonor, deleteDonor, getDonorByUsername };
