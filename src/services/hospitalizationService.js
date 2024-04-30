const { Op } = require('sequelize');
const Operation = require('../models/operation');
const OperationPricing = require('../models/operationPricing');
const OperationShare = require('../models/operationShare');
const HospitalOperationMapping = require('../models/hospitalOperationMapping');
const Hospital = require('../models/hospital');

const searchOperationsBySystemPrivate = async (system) => {
  const operations= await Operation.findAll({
    where: { system },
    attributes: ['Name', 'Description', 'Code'],
    include: [
      {
        model: OperationPricing,
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
const searchOperationsBySystemPublic = async (system) => {
  const operations= await Operation.findAll({
    where: { system },
    attributes: ['name', 'description', 'code'],
    include: [
      {
        model: OperationPricing,
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
const searchOperationPrivate = async (query) => {
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
        model: OperationPricing,
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
        model: OperationPricing,
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
        model: OperationPricing,
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
        model: OperationPricing,
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

module.exports = {
  searchOperationsBySystemPrivate,
  searchOperationsBySystemPublic,
  searchOperationPrivate,
  searchOperationPublic,
  searchOperationByHospitalName,
  getOperationById,
};