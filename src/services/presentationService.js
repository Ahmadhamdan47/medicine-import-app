const  DrugPresentation  = require("../models/drugPresentation"); // Ensure correct model import

// Fetch all presentations
const getAllPresentations = async () => {
  try {
    return await DrugPresentation.findAll();
  } catch (error) {
    console.error('Error fetching presentations:', error);
    throw new Error('Failed to fetch presentations');
  }
};

// Fetch a specific presentation by ID
const getPresentationById = async (id) => {
  try {
    const presentation = await DrugPresentation.findOne({ where: { id } });
    if (!presentation) {
      throw new Error(`Presentation with ID ${id} not found`);
    }
    return presentation;
  } catch (error) {
    console.error('Error fetching presentation by ID:', error);
    throw new Error('Failed to fetch presentation');
  }
};

// Create a new presentation
const createPresentation = async (data) => {
  try {
    return await DrugPresentation.create(data);
  } catch (error) {
    console.error('Error creating presentation:', error);
    throw new Error('Failed to create presentation');
  }
};

// Update an existing presentation
const updatePresentation = async (id, data) => {
  try {
    const presentation = await DrugPresentation.findOne({ where: { id } });
    if (!presentation) {
      throw new Error(`Presentation with ID ${id} not found`);
    }
    await presentation.update(data);
    return presentation;
  } catch (error) {
    console.error('Error updating presentation:', error);
    throw new Error('Failed to update presentation');
  }
};

// Delete a presentation by ID
const deletePresentation = async (id) => {
  try {
    const presentation = await DrugPresentation.findOne({ where: { id } });
    if (!presentation) {
      throw new Error(`Presentation with ID ${id} not found`);
    }
    await presentation.destroy();
    return { message: 'Presentation deleted successfully' };
  } catch (error) {
    console.error('Error deleting presentation:', error);
    throw new Error('Failed to delete presentation');
  }
};
const updatePresentationsByDrugId = async (DrugId, data) => {
    try {
      const presentations = await DrugPresentation.findAll({ where: { DrugId } });
      if (!presentations.length) {
        throw new Error(`No presentations found for DrugId: ${DrugId}`);
      }
  
      const updatedPresentations = [];
      for (const presentation of presentations) {
        await presentation.update(data);
        updatedPresentations.push(presentation);
      }
  
      return updatedPresentations;
    } catch (error) {
      console.error('Error updating presentations by DrugId:', error);
      throw new Error('Failed to update presentations');
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
