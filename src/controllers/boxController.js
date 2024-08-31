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
 */
const deleteBox = async (req, res) => {
  try {
    await boxService.deleteBox(req.params.boxId);
    res.status(200).json({ message: 'Box deleted successfully.' });
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

module.exports = {
  createBox,
  deleteBox,
  getBoxById,
  updateBox
};
