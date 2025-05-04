const dashboardService = require('../services/dashboardService');

const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

const getDrugsByManufacturer = async (req, res, next) => {
  try {
    const data = await dashboardService.getDrugsByManufacturer();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getDrugsByCountry = async (req, res, next) => {
  try {
    const data = await dashboardService.getDrugsByCountry();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getDrugsByManufacturer,
  getDrugsByCountry
};
