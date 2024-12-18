const presentationService = require('../services/presentationService');

// Get all presentations
const getAllPresentations = async (req, res) => {
  try {
    const presentations = await presentationService.getAllPresentations();
    res.status(200).json(presentations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific presentation by ID
const getPresentationById = async (req, res) => {
  try {
    const { id } = req.params;
    const presentation = await presentationService.getPresentationById(id);
    res.status(200).json(presentation);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Create a new presentation
const createPresentation = async (req, res) => {
  try {
    const presentation = await presentationService.createPresentation(req.body);
    res.status(201).json(presentation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing presentation
const updatePresentation = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPresentation = await presentationService.updatePresentation(id, req.body);
    res.status(200).json(updatedPresentation);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Delete a presentation by ID
const deletePresentation = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await presentationService.deletePresentation(id);
    res.status(200).json(message);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const updatePresentationsByDrugId = async (req, res) => {
    try {
      const { DrugId } = req.params;
      const updatedPresentations = await presentationService.updatePresentationsByDrugId(DrugId, req.body);
      res.status(200).json(updatedPresentations);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
module.exports = {
  getAllPresentations,
  getPresentationById,
  createPresentation,
  updatePresentation,
  deletePresentation,
  updatePresentationsByDrugId
};
