const donationService = require("../services/donationService");

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
  const DonationId = req.params.id;

  try {
    const donation = await donationService.getDonationById(DonationId);
    res.json(donation);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

module.exports = { addDonation, getAllDonations, getDonationById };
