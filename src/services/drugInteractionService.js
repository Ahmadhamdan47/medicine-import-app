const DrugInteraction = require("../models/drugInteraction");

const getInteractionsByDrugId = async (DrugID) => {
  try {
    const interactions = await DrugInteraction.findAll({
      where: { DrugID },
    });
    return interactions;
  } catch (error) {
    console.error("Error fetching drug interactions:", error);
    throw error;
  }
};

const addInteraction = async (interactionData) => {
  try {
    const interaction = await DrugInteraction.create(interactionData);
    return interaction;
  } catch (error) {
    console.error("Error adding drug interaction:", error);
    throw error;
  }
};

const editInteraction = async (DrugInteractionID, interactionData) => {
  try {
    const interaction = await DrugInteraction.update(interactionData, {
      where: { DrugInteractionID },
    });
    return interaction;
  } catch (error) {
    console.error("Error editing drug interaction:", error);
    throw error;
  }
};

const deleteInteraction = async (DrugInteractionID) => {
  try {
    const interaction = await DrugInteraction.destroy({
      where: { DrugInteractionID },
    });
    return interaction;
  } catch (error) {
    console.error("Error deleting drug interaction:", error);
    throw error;
  }
};

const getInteractionsByDrugName = async (DrugName) => {
  try {
    const drug = await Drug.findOne({
      where: { DrugName },
    });

    if (!drug) {
      throw new Error(`Drug not found: ${DrugName}`);
    }

    const interactions = await DrugInteraction.findAll({
      where: { DrugID: drug.DrugID },
    });
    return interactions;
  } catch (error) {
    console.error("Error fetching drug interactions:", error);
    throw error;
  }
};

module.exports = {
  getInteractionsByDrugId,
  addInteraction,
  editInteraction,
  deleteInteraction,
  getInteractionsByDrugName,
};
