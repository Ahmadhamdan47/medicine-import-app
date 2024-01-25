// src/controllers/drugController.js

const DrugService = require('../services/drugService');

const searchDrugByATCName = async (req, res) => {
  const query = req.params.query;

  try {
    const result = await DrugService.searchDrugByATCName(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const searchDrugByBrandName = async (req, res) => {
  const query = req.params.query;

  try {
    const result = await DrugService.searchDrugByBrandName(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getDrugByGuid = async (req, res) => {
  try {
    const { guid } = req.params;
    const drug = await getDrugByGuid(guid);
    if (!drug) {
      return res.status(404).json({ error: 'Drug not found' });
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
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  searchDrugByATCName,
  searchDrugByBrandName,
  getDrugByGuid,
  filterDrugs,
};