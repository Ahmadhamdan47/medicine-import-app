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
        const donor = await donorService.editDonor(req.params.donorId, req.body);
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

module.exports = { addDonor, getAllDonors, editDonor, deleteDonor };