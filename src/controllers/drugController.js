const DrugService = require("../services/drugService");

const addPharmacyDrug = async (req, res) => {
  const drugData = req.body;

  try {
    const newDrug = await DrugService.addPharmacyDrug(drugData);
    res.json(newDrug);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const addDrug = async (req, res) => {
  const drugData = req.body;

  try {
    const newDrug = await DrugService.addDrug(drugData);
    res.json(newDrug);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const searchDrugByATCName = async (req, res) => {
  const query = req.params.query;

  try {
    const result = await DrugService.searchDrugByATCName(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const searchDrugByName = async (req, res) => {
  const query = req.params.query;

  try {
    const result = await DrugService.searchDrugByName(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getDrugById = async (req, res) => {
  try {
    const { DrugID } = req.params;
    const drug = await DrugService.getDrugById(DrugID);

    if (!drug) {
      return res.status(404).json({ error: "Drug not found" });
    }

    res.json(drug);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const filterDrugs = async (req, res) => {
  const query = req.params.query;

  try {
    const searchResults = await DrugService.searchDrugByATCName(query);
    const filteredResults = await DrugService.filterDrugs(searchResults);
    res.json(filteredResults);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllDrugs = async (req, res, next) => {
  try {
    const drugs = await DrugService.getAllDrugs();
    res.status(200).json(drugs);
  } catch (error) {
    next(error);
  }
};

const smartSearch = async (req, res) => {
  const searchTerm = req.params.query;

  try {
    const results = await DrugService.smartSearch(searchTerm);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getDrugByATCLevel = async (req, res) => {
  const atcCode = req.params.atcCode;

  try {
    const drugs = await DrugService.getDrugByATCLevel(atcCode);
    res.json(drugs);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const addDrugATC = async (req, res) => {
  const { DrugID, ATC_ID } = req.body;

  try {
    const newMapping = await DrugService.addDrugATC(DrugID, ATC_ID);
    res.json(newMapping);
  } catch (error) {
    // Handle the error when the drug is already a substitute
    if (error.message === 'Drug is already a substitute') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.toString() });
    }
  }
};
module.exports = {
  searchDrugByATCName,
  searchDrugByName,
  getDrugById,
  filterDrugs,
  addDrug,
  addPharmacyDrug,
  getAllDrugs,
  smartSearch,
  getDrugByATCLevel,
  addDrugATC
};
