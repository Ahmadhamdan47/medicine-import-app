// src/controllers/drugController.js

const DrugService = require('../services/drugService');

const searchDrug = async (req, res) => {
  const query = req.params.query;

  try {
    const result = await DrugService.searchDrug(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  searchDrug,
};
