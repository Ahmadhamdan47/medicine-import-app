const { Op } = require('sequelize');
const Operation = require('../models/operation');
const CategoryPricing = require('../models/categoryPricing');
const OperationShare = require('../models/operationShare');
const HospitalOperationMapping = require('../models/hospitalOperationMapping');
const Hospital = require('../models/hospital');

const searchOperationsBySystemPrivate = async (System) => {
  const operations = await Operation.findAll({
    where: { System },
    attributes: ['ID','Name', 'Description', 'Code'],
  });

  for (let operation of operations) {
    operation.dataValues.categoryPricing = await getCategoryPricingByOperationIdPrivate(operation.ID);
    operation.dataValues.operationShare = await getOperationShareByOperationIdPrivate(operation.ID);
  }

  return operations;
};

const searchOperationsBySystemPublic = async (System) => {
  const operations = await Operation.findAll({
    where: { System },
    attributes: ['ID','Name', 'Description', 'Code'],
  });

  for (let operation of operations) {
    operation.dataValues.categoryPricing = await getCategoryPricingByOperationIdPublic(operation.ID);
    operation.dataValues.operationShare = await getOperationShareByOperationIdPublic(operation.ID);
  }

  return operations;
};const searchOperationPrivate = async (query) => {
  const operations= await Operation.findAll({
    where: {
      [Op.or]: [
        { Code: query },
        { Name: query }
      ]
    },
    attributes: ['Name', 'Description', 'Code'],
    include: [
      {
        model: categoryPricing,
        where: { isPrivate: true },
        attributes: ['CategoryType', 'TotalAmount'],      
    },
      {
        model: OperationShare,
        where: { isPrivate: true },
        attributes: ['Category1', 'Category2', 'Category3'],
      },
    ],
  });
  operations.forEach(operation => {
    operation.OperationShares.forEach(share => {
      share.dataValues.shareAmount = share.Category1 * operation.OperationPricings[0].dataValues.TotalAmount / 100;
      share.dataValues.shareAmount = share.Category2 * operation.OperationPricings[0].dataValues.TotalAmount / 100;
      share.dataValues.shareAmount = share.Category3 * operation.OperationPricings[0].dataValues.TotalAmount / 100;
    });
  });
  return operations;
};

const searchOperationPublic = async (query) => {
  const operations= await Operation.findAll({
    where: {
      [Op.or]: [
        { Code: query },
        { Name: query }
      ]
    },
    attributes: ['Name', 'Description', 'Code'],
    include: [
      {
        model: categoryPricing,
        where: { isPrivate: false },
        attributes: ['CategoryType', 'TotalAmount'],      },
      {
        model: OperationShare,
        where: { isPrivate: false },
        attributes: ['Category1', 'Category2', 'Category3'],
      },
    ],
  });
  operations.forEach(operation => {
    operation.OperationShares.forEach(share => {
      share.dataValues.shareAmount = share.Category1 * operation.OperationPricings[0].dataValues.TotalAmount / 100;
      share.dataValues.shareAmount = share.Category2 * operation.OperationPricings[0].dataValues.TotalAmount / 100;
      share.dataValues.shareAmount = share.Category3 * operation.OperationPricings[0].dataValues.TotalAmount / 100;
    });
  });
  return operations;
};

const searchOperationByHospitalName = async (hospitalName) => {
  const hospital = await Hospital.findOne({ where: { hospitalName } });
  if (!hospital) {
    throw new Error(`Hospital with name ${hospitalName} not found`);
  }

  const operations = await Operation.findAll({
    include: [
      {
        model: categoryPricing,
        attributes: ['CategoryType', 'TotalAmount'],
        group: ['OperationId']
      },
      {
        model: OperationShare,
        attributes: ['Category1', 'Category2', 'Category3'],
      },
      {
        model: HospitalOperationMapping,
        where: { HospitalId: hospital.ID },
        attributes: [],
      },
    ],
  });

  operations.forEach(operation => {
    operation.OperationShares.forEach(share => {
      share.dataValues.shareAmount = share.Category1 * operation.OperationPricings[0].dataValues.TotalAmount / 100;
      share.dataValues.shareAmount = share.Category2 * operation.OperationPricings[0].dataValues.TotalAmount / 100;
      share.dataValues.shareAmount = share.Category3 * operation.OperationPricings[0].dataValues.TotalAmount / 100;
    });
  });

  return operations;
};
const getOperationById = async (operationId) => {
  const operation = await Operation.findOne({
    where: { ID: operationId },
    attributes: ['Name', 'Description', 'Code'],
    include: [
      {
        model: categoryPricing,
        attributes: { exclude: ['ID'] }
      },
      {
        model: OperationShare,
        attributes: ['Category1', 'Category2', 'Category3'],
      },
    ],
  });

  if (!operation) {
    throw new Error(`Operation with ID ${operationId} not found`);
  }

  operation.OperationShares.forEach(share => {
    share.dataValues.shareAmount = share.Category1 * operation.OperationPricings[0].dataValues.TotalAmount / 100;
    share.dataValues.shareAmount = share.Category2 * operation.OperationPricings[0].dataValues.TotalAmount / 100;
    share.dataValues.shareAmount = share.Category3 * operation.OperationPricings[0].dataValues.TotalAmount / 100;
  });

  return operation;
};
const getCategoryPricingByOperationIdPrivate = async (operationId) => {
  const operation = await Operation.findOne({
    where: { id: operationId },
    include: [
      {
        model: CategoryPricing, // Use the model name directly
        where: { isPrivate: true },
        attributes: ['CategoryType', 'TotalAmount'],
      },
    ],
  });

  if (!operation) {
    throw new Error(`Operation with ID ${operationId} not found`);
  }

  const categoryPricing = await CategoryPricing.findAll({
    where: { OperationId: operation.ID, isPrivate: true }, // Use operation.id instead of operation.operationId
    attributes: ['CategoryType', 'TotalAmount'],
  });

  return categoryPricing;
};

const getCategoryPricingByOperationIdPublic = async (operationId) => {
  const operation = await Operation.findOne({
    where: { id: operationId },
    include: [
      {
        model: categoryPricing,
        where: { isPrivate: false },
        attributes: ['CategoryType', 'TotalAmount'],
      },
    ],
  });

  if (!operation) {
    throw new Error(`Operation with ID ${operationId} not found`);
  }
  const categoryPricing = await CategoryPricing.findAll({
    where: { OperationId: operation.ID, isPrivate: true }, // Use operation.id instead of operation.operationId
    attributes: ['CategoryType', 'TotalAmount'],
  });

  return categoryPricing;
};
const getOperationShareByOperationIdPrivate = async (operationId) => {
  const operation = await Operation.findOne({
    where: { id: operationId },
    include: [
      {
        model: OperationShare,
        where: { isPrivate: true },
        attributes: ['Category1', 'Category2', 'Category3'],
      },
    ],
  });

  if (!operation) {
    throw new Error(`Operation with ID ${operationId} not found`);
  }
const operationShare = await OperationShare.findAll({
    where: { OperationId: operation.ID, isPrivate: true }, // Use operation.id instead of operation.operationId
    attributes: ['Category1', 'Category2', 'Category3'],
  });
  return operationShare;
};

const getOperationShareByOperationIdPublic = async (operationId) => {
  const operation = await Operation.findOne({
    where: { id: operationId },
    include: [
      {
        model: OperationShare,
        where: { isPrivate: false },
        attributes: ['Category1', 'Category2', 'Category3'],
      },
    ],
  });

  if (!operation) {
    throw new Error(`Operation with ID ${operationId} not found`);
  }
  const operationShare = await OperationShare.findAll({
    where: { OperationId: operation.ID, isPrivate: true }, // Use operation.id instead of operation.operationId
    attributes: ['Category1', 'Category2', 'Category3'],
  });
  return operationShare;
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