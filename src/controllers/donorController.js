const donorService = require('../services/donorService');

const addDonor = async (req, res) => {
    const donorData = req.body;

    try {
        const newDonor = await donorService.addDonor(donorData);
        res.status(201).json(newDonor);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getAllDonors = async (req, res) => {
    try {
        const donors = await donorService.getAllDonors();
        res.json(donors);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const editDonor = async (req, res) => {
    try {
        const donor = await donorService.editDonor(req.params.DonorId, req.body);
        res.json(donor);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const deleteDonor = async (req, res) => {
    try {
        await donorService.deleteDonor(req.params.donorId);
        res.json({ message: 'Donor deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};
const getDonorByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const donor = await donorService.getDonorByUsername(username);
        res.status(200).json(donor);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
const getIsActiveStatus = async (req, res) => {
    const { donorId } = req.params;

    try {
        const isActive = await donorService.getIsActiveByDonorId(donorId);
        res.json({ isActive });
    } catch (error) {
        res.status(500).json({ error: error.message || 'An error occurred while fetching the isActive status.' });
    }
};
const getDonorById = async (req, res) => {
    try {
        const { donorId } = req.params;
        const donor = await donorService.getDonorById(donorId);
        res.status(200).json(donor);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
module.exports = { addDonor, getAllDonors, editDonor, deleteDonor, getDonorByUsername, getIsActiveStatus, getDonorById  };