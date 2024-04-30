const drugInteractionService = require("../services/drugInteractionService");

// const getInteractionsByDrugId = async (req, res) => {
//     try {
//         const { DrugID } = req.params;
//         const interactions = await CSSCounterStyleRule.getInteractionsByDrugId(DrugID);
//         res.json(interactions);
//     } catch (error) {
//         res.status(500).json({ error: error.toString() });
//     }
// };

const getInteractionsByDrugId = async (req, res) => {
  try {
    const { DrugID } = req.params;

    const interactions = await drugInteractionService.getInteractionsByDrugId(
      DrugID
    );
    res.json(interactions);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const addInteraction = async (req, res) => {
  try {
    const interactionData = req.body;
    const interaction = await drugInteractionService.addInteraction(
      interactionData
    );
    res.json(interaction);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const editInteraction = async (req, res) => {
  try {
    const { DrugInteractionID } = req.params;
    const interactionData = req.body;
    const interaction = await drugInteractionService.editInteraction(
      DrugInteractionID,
      interactionData
    );
    res.json(interaction);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const deleteInteraction = async (req, res) => {
  try {
    const { DrugInteractionID } = req.params;
    const interaction = await drugInteractionService.deleteInteraction(
      DrugInteractionID
    );
    res.json(interaction);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const getInteractionsByDrugName = async (req, res) => {
  try {
    const { DrugName } = req.params;
    const interactions = await drugInteractionService.getInteractionsByDrugName(
      DrugName
    );
    res.json(interactions);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

module.exports = {
  getInteractionsByDrugId,
  addInteraction,
  editInteraction,
  deleteInteraction,
  getInteractionsByDrugName,
};
