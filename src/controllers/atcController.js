// src/controllers/ATCController.js

const ATCService = require("../services/atcService");

const getATCByDrugID = async (req, res) => {
  try {
    const atcCode = await ATCService.getATCByDrugID(req.params.drugID);
    res.json(atcCode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllATCCodes = async (req, res) => {
  try {
    const allATCCodes = await ATCService.getAllATCCodes();
    res.json(allATCCodes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createATCCode = async (req, res) => {
  try {
    const { Code, Name, Description, ParentID } = req.body;
    const newATCCode = await ATC_Code.create({
      Code,
      Name,
      Description,
      ParentID,
    });
    res.status(201).json(newATCCode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteATCCode = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedATCCode = await ATC_Code.destroy({ where: { ATC_ID: id } });
    if (!deletedATCCode) {
      res.status(404).json({ message: `ATC code with ID ${id} not found.` });
      return;
    }
    res.json({ message: `ATC code with ID ${id} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getATCByDrugID,
  getAllATCCodes,
  createATCCode,
  deleteATCCode,
};
