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
const fetchDonationsByDonor = async (req, res) => {
  try {
    const { donorId } = req.params;
    const donations = await donationService.getDonationsByDonor(donorId);
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to fetch donations by recipient
const fetchDonationsByRecipient = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const donations = await donationService.getDonationsByRecipient(recipientId);
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to fetch donations by date range
const fetchDonationsByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const donations = await donationService.getDonationsByDate(startDate, endDate);
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to fetch donations by status
const fetchDonationsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const donations = await donationService.getDonationsByStatus(status);
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getFilteredDonations = async (req, res) => {
  try {
    // Extract query parameters from the request
    const { donorId, recipientId, startDate, endDate, status } = req.query;

    // Create a filters object based on the query parameters
    const filters = {
      donorId,
      recipientId,
      startDate,
      endDate,
      status,
    };

    // Call the service function to get filtered donations
    const donations = await getFilteredDonations(filters);

    // Respond with the fetched donations
    res.status(200).json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
};

module.exports = { addDonation, getAllDonations, getDonationById, editDonation, createBatchLot,getDonationsByDonor, fetchDonationsByDonor,
  fetchDonationsByRecipient,
  fetchDonationsByDate,
  fetchDonationsByStatus,getFilteredDonations};


