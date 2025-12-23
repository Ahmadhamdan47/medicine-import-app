// src/controllers/boxController.js
const boxService = require('../services/boxService');

/**
 * Handle request to create a new box.
 */
const createBox = async (req, res) => {
  try {
    const box = await boxService.createBox(req.body);
    res.status(201).json(box);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Handle request to delete a box.
 * Optionally accepts deletedBy and deletionReason from request body or authenticated user.
 */
const deleteBox = async (req, res) => {
  try {
    // Extract optional metadata from body or authenticated user
    const deletedBy = req.body.deletedBy || req.user?.username || req.user?.email || null;
    const deletionReason = req.body.deletionReason || null;
    
    const result = await boxService.deleteBox(req.params.boxId, deletedBy, deletionReason);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Handle request to get a box by ID.
 */
const getBoxById = async (req, res) => {
  try {
    const box = await boxService.getBoxById(req.params.boxId);
    res.status(200).json(box);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Handle request to update a box.
 */
const updateBox = async (req, res) => {
  try {
    const box = await boxService.updateBox(req.params.boxId, req.body);
    res.status(200).json(box);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getBoxesByDonation = async (req, res) => {
    const { donationId } = req.params;

    try {
        const boxes = await boxService.getBoxesByDonation(donationId);
        res.status(200).json(boxes);
    } catch (error) {
        console.error('Error in getBoxesByDonationController:', error);
        res.status(500).json({ message: 'Failed to fetch boxes for the donation' });
    }
};
const markBoxAsInspected = async (req, res) => {
    const { boxId } = req.params;
  
    try {
      await boxService.markBoxAsInspected(boxId);
      res.status(200).json({ message: 'Box marked as inspected successfully.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Controller function to mark a box as rejected
  const markBoxAsRejected = async (req, res) => {
    const { boxId } = req.params;
  
    try {
      await boxService.markBoxAsRejected(boxId);
      res.status(200).json({ message: 'Box marked as rejected successfully.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
module.exports = {
  createBox,
  deleteBox,
  getBoxById,
  updateBox,
  getBoxesByDonation,
  markBoxAsInspected,
  markBoxAsRejected
};
