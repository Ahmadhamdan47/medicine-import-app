const hospitalizationService = require('../services/hospitalizationService');

const searchOperationsBySystemPrivate = async (req, res) => {
  const System = req.params.system;
  try {
    const operations = await hospitalizationService.searchOperationsBySystemPrivate(System);
    res.status(200).json(operations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchOperationsBySystemPublic = async (req, res) => {
  const System = req.params.system;
  try {
    const operations = await hospitalizationService.searchOperationsBySystemPublic(System);
    res.status(200).json(operations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchOperationPrivate = async (req, res) => {
  const query = req.params.query;
  try {
    const operations = await hospitalizationService.searchOperationPrivate(query);
    res.status(200).json(operations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchOperationPublic = async (req, res) => {
  const query = req.params.query;
  try {
    const operations = await hospitalizationService.searchOperationPublic(query);
    res.status(200).json(operations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const searchOperationByHospitalName = async (req, res) => {
  const hospitalName = req.params.hospitalName;
  try {
    const operations = await hospitalizationService.searchOperationByHospitalName(hospitalName);
    res.status(200).json(operations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getOperationById = async (req, res) => {
  const operationId = req.params.operationId;
  try {
    const operation = await hospitalizationService.getOperationById(operationId);
    res.status(200).json(operation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getCategoryPricingByOperationIdPrivate = async (req, res) => {
  const operationId = req.params.id;
  const operation = await hospitalizationService.getCategoryPricingByOperationIdPrivate(operationId);
  res.json(operation);
};

const getCategoryPricingByOperationIdPublic = async (req, res) => {
  const operationId = req.params.id;
  const operation = await hospitalizationService.getCategoryPricingByOperationIdPublic(operationId);
  res.json(operation);
};
const getOperationShareByOperationIdPrivate = async (req, res, next) => {
  try {
    const operationId = req.params.id;
    const operation = await hospitalizationService.getOperationShareByOperationIdPrivate(operationId);
    res.json(operation);
  } catch (error) {
    next(error);
  }
};

const getOperationShareByOperationIdPublic = async (req, res, next) => {
  try {
    const operationId = req.params.id;
    const operation = await hospitalizationService.getOperationShareByOperationIdPublic(operationId);
    res.json(operation);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  searchOperationsBySystemPrivate,
  searchOperationsBySystemPublic,
  searchOperationPrivate,
  searchOperationPublic,
  searchOperationByHospitalName,
  getOperationById,
  getCategoryPricingByOperationIdPrivate,
  getCategoryPricingByOperationIdPublic,
  getOperationShareByOperationIdPrivate,
  getOperationShareByOperationIdPublic,
};