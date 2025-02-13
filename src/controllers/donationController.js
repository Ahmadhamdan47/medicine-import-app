const donationService = require('../services/donationService');

const addDonation = async (req, res) => {
    const donationData = req.body;

    try {
        const newDonation = await donationService.createDonation(donationData);
        res.json(newDonation);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getAllDonations = async (req, res) => {
    try {
        const donations = await donationService.getAllDonations();
        res.json(donations);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getDonationById = async (req, res) => {
    try {
      const donation = await donationService.getDonationById(req.params.DonationId);
      res.json(donation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  const editDonation = async (req, res) => {
  try {
    const { DonationId } = req.params;
    const donationData = req.body;
    const donation = await donationService.editDonation(DonationId, donationData);
    res.json(donation);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};
const createBatchLot = async (req, res) => {
  try {
    const batchLotData = req.body;
    const batchLot = await donationService.createBatchLot(batchLotData);
    res.json(batchLot);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};
const getDonationsByDonor = async (req, res) => {
  try {
      const { donorId } = req.params;
      const donations = await donationService.getDonationsByDonor(donorId);
      res.status(200).json(donations);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

const getFilteredDonations = async (req, res) => {
  try {
    const { donorId, recipientId, status, startDate, endDate } = req.query;
    const donations = await donationService.getFilteredDonations({ donorId, recipientId, status, startDate, endDate });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getDonationsByRecipient = async (req, res) => {
  try {
    const { recipientId } = req.params; // Extract recipientId from request parameters
    const donations = await donationService.getDonationsByRecipient(recipientId); // Call the service function
    res.status(200).json(donations); // Return the donations as JSON response
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors and return a 500 status code
  }
};
module.exports = { 
  addDonation, 
  getAllDonations, 
  getDonationById, 
  editDonation, 
  createBatchLot,
  getDonationsByDonor, 
  getFilteredDonations,  
  getDonationsByRecipient, // Add the new controller here
};


