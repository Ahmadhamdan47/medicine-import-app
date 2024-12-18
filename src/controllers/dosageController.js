const dosageService = require('../services/dosageService');

// Get all dosages
const getAllDosages = async (req, res) => {
  try {
    const dosages = await dosageService.getAllDosages();
    res.status(200).json(dosages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific dosage by ID
const getDosageById = async (req, res) => {
  try {
    const { id } = req.params;
    const dosage = await dosageService.getDosageById(id);
    res.status(200).json(dosage);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Create a new dosage
const createDosage = async (req, res) => {
  try {
    const dosage = await dosageService.createDosage(req.body);
    res.status(201).json(dosage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing dosage
const updateDosage = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDosage = await dosageService.updateDosage(id, req.body);
    res.status(200).json(updatedDosage);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Delete a dosage by ID
const deleteDosage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await dosageService.deleteDosage(id);
    res.status(200).json(message);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const updateDosagesByDrugId = async (req, res) => {
    try {
      const { DrugId } = req.params;
      const updatedDosages = await dosageService.updateDosagesByDrugId(DrugId, req.body);
      res.status(200).json(updatedDosages);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
module.exports = {
  getAllDosages,
  getDosageById,
  createDosage,
  updateDosage,
  deleteDosage,
  updateDosagesByDrugId,

};
