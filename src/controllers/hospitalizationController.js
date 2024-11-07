const hospitalizationService = require('../services/hospitalizationService');

const searchOperationsBySystemPrivate = async (req, res) => {
  const systemNameOrNameAR = req.params.system;
  try {
    const operations = await hospitalizationService.searchOperationsBySystemPrivate(systemNameOrNameAR);
    res.status(200).json(operations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchOperationsBySystemPublic = async (req, res) => {
  const systemNameOrNameAR = req.params.system;
  try {
    const operations = await hospitalizationService.searchOperationsBySystemPublic(systemNameOrNameAR);
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
  const operationId = req.params.operationId;
  const operation = await hospitalizationService.getCategoryPricingByOperationIdPrivate(operationId);
  res.json(operation);
};

const getCategoryPricingByOperationIdPublic = async (req, res) => {
  const operationId = req.params.operationId;
  const operation = await hospitalizationService.getCategoryPricingByOperationIdPublic(operationId);
  res.json(operation);
};
const getOperationSharePrivate = async (req, res, next) => {
  try {
    const operationShares = await hospitalizationService.getOperationSharePrivate();
    res.json(operationShares);
  } catch (error) {
    next(error);
  }
};

const getOperationSharePublic = async (req, res, next) => {
  try {
    const operationShares = await hospitalizationService.getOperationSharePublic();
    res.json(operationShares);
  } catch (error) {
    next(error);
  }
};
const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await hospitalizationService.getAllHospitals();
    res.status(200).json(hospitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOperations = async (req, res) => {
  try {
    const operations = await hospitalizationService.getAllOperations();
    res.status(200).json(operations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOperationSystems = async (req, res) => {
  try {
    const operationSystems = await hospitalizationService.getAllOperationSystems();
    res.status(200).json(operationSystems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const addOperation = async (req, res) => {
  const operationData = req.body.operationData;
  const categoryPricingData = req.body.categoryPricingData;
  try {
      const result = await hospitalizationService.addOperation(operationData, categoryPricingData);
      res.status(201).json(result);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
const filterOperations = async (req, res) => {
  const { system, name, hospitalCategoryType, hospitalName } = req.query;

  try {
    const operations = await hospitalizationService.filterOperations({ system, name, hospitalCategoryType, hospitalName });
    res.status(200).json(operations);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  getOperationSharePrivate,
  getOperationSharePublic,
  getAllHospitals,
  getAllOperations,
  getAllOperationSystems,
  addOperation,
  filterOperations
};