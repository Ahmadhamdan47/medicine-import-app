const Dosage  = require("../models/dosage"); // Ensure correct model import

// Fetch all dosages
const getAllDosages = async () => {
  try {
    return await Dosage.findAll();
  } catch (error) {
    console.error('Error fetching dosages:', error);
    throw new Error('Failed to fetch dosages');
  }
};

// Fetch a specific dosage by ID
const getDosageById = async (id) => {
  try {
    const dosage = await Dosage.findOne({ where: { DosageId: id } });
    if (!dosage) {
      throw new Error(`Dosage with ID ${id} not found`);
    }
    return dosage;
  } catch (error) {
    console.error('Error fetching dosage by ID:', error);
    throw new Error('Failed to fetch dosage');
  }
};

// Create a new dosage
const createDosage = async (data) => {
  try {
    return await Dosage.create(data);
  } catch (error) {
    console.error('Error creating dosage:', error);
    throw new Error('Failed to create dosage');
  }
};

// Update an existing dosage
const updateDosage = async (id, data) => {
  try {
    const dosage = await Dosage.findOne({ where: { DosageId: id } });
    if (!dosage) {
      throw new Error(`Dosage with ID ${id} not found`);
    }
    await dosage.update(data);
    return dosage;
  } catch (error) {
    console.error('Error updating dosage:', error);
    throw new Error('Failed to update dosage');
  }
};

// Delete a dosage by ID
const deleteDosage = async (id) => {
  try {
    const dosage = await Dosage.findOne({ where: { DosageId: id } });
    if (!dosage) {
      throw new Error(`Dosage with ID ${id} not found`);
    }
    await dosage.destroy();
    return { message: 'Dosage deleted successfully' };
  } catch (error) {
    console.error('Error deleting dosage:', error);
    throw new Error('Failed to delete dosage');
  }
};
const updateDosagesByDrugId = async (DrugId, data) => {
    try {
      const dosages = await Dosage.findAll({ where: { DrugId } });
      if (!dosages.length) {
        throw new Error(`No dosages found for DrugId: ${DrugId}`);
      }
  
      const updatedDosages = [];
      for (const dosage of dosages) {
        await dosage.update(data);
        updatedDosages.push(dosage);
      }
  
      return updatedDosages;
    } catch (error) {
      console.error('Error updating dosages by DrugId:', error);
      throw new Error('Failed to update dosages');
    }
  };
module.exports = {
  getAllDosages,
  getDosageById,
  createDosage,
  updateDosage,
  deleteDosage,
  updateDosagesByDrugId
};
