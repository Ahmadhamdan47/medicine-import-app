const { Op } = require('sequelize');
const Operation = require('../models/operation');
const CategoryPricing = require('../models/categoryPricing');
const OperationShare = require('../models/operationShare');
const HospitalOperationMapping = require('../models/hospitalOperationMapping');
const Hospital = require('../models/hospital');

const OperationSystems = require('../models/opeartionsystems'); // Assuming the model is in the same directory
const { search } = require('../routes/drugRoutes');

const searchOperationsBySystemPrivate = async (systemNameOrNameAR) => {
  // Find the corresponding systemChar from the operationsystems table
  const operationSystem = await OperationSystems.findOne({
    where: {
      [Op.or]: [
        { systemName: systemNameOrNameAR },
        { NameAR: systemNameOrNameAR }
      ]
    }
  });
  console.log(operationSystem);

  if (!operationSystem) {
    throw new Error('No matching operation system found');
  }

  const operations = await Operation.findAll({
    where: { systemChar: operationSystem.systemChar },
    attributes: ['ID','Name','NameAr','Anesthetic','Description','DescriptionAR','Los', 'Code'],
  });
console.log(operations);
  const operationShare = await getOperationSharePrivate();
  console.log(operationShare);

  for (let operation of operations) {
    operationId = operation.ID;
    const categoryPricing = await getCategoryPricingByOperationIdPrivate(operationId);
    operation.dataValues.categoryPricing = categoryPricing;
console.log(categoryPricing);
    // Calculate patientShareCategory1, patientShareCategory2, and patientShareCategory3
    
const operationShareValue = operationShare[0].Share;
console.log(operationShareValue);
const categoryPricingValues = categoryPricing[0];
// Then use operationShareValue instead of operationShare.Share
operation.dataValues.patientShareCategory1 = categoryPricingValues.FirstCategory1 * operationShareValue/100;
operation.dataValues.patientShareCategory2 = categoryPricingValues.FirstCategory2 * operationShareValue/100;
operation.dataValues.patientShareCategory3 = categoryPricingValues.FirstCategory3 * operationShareValue/100;
    // Check the Anesthetic value and modify it if necessary
    if (operation.dataValues.Anesthetic === 'G') {
      operation.dataValues.Anesthetic = 'Global Anesthesia';
    } else if (operation.dataValues.Anesthetic === 'L') {
      operation.dataValues.Anesthetic = 'Local Anesthesia';
    }
  }

  return operations;
};

const searchOperationsBySystemPublic = async (systemNameOrNameAR) => {
  // Find the corresponding systemChar from the operationsystems table
  const operationSystem = await OperationSystems.findOne({
    where: {
      [Op.or]: [
        { systemName: systemNameOrNameAR },
        { NameAR: systemNameOrNameAR }
      ]
    }
  });

  if (!operationSystem) {
    throw new Error('No matching operation system found');
  }

  const operations = await Operation.findAll({
    where: { systemChar: operationSystem.systemChar },
    attributes: ['ID','Name','NameAr','Anesthetic','Description','DescriptionAR','Los', 'Code'],
  });

  const operationShare = await getOperationSharePublic();

  for (let operation of operations) {
    const categoryPricing = await getCategoryPricingByOperationIdPublic(operation.ID);
    operation.dataValues.categoryPricing = categoryPricing;
    const operationShareValue = operationShare[0].Share;
    console.log(operationShareValue);
    const categoryPricingValues = categoryPricing[0];
    // Then use operationShareValue instead of operationShare.Share
    operation.dataValues.patientShareCategory1 = categoryPricingValues.FirstCategory1 * operationShareValue/100;
    operation.dataValues.patientShareCategory2 = categoryPricingValues.FirstCategory2 * operationShareValue/100;
    operation.dataValues.patientShareCategory3 = categoryPricingValues.FirstCategory3 * operationShareValue/100;

    // Check the Anesthetic value and modify it if necessary
    if (operation.dataValues.Anesthetic === 'G') {
      operation.dataValues.Anesthetic = 'Global Anesthesia';
    } else if (operation.dataValues.Anesthetic === 'L') {
      operation.dataValues.Anesthetic = 'Local Anesthesia';
    }
  }

  return operations;
};

const searchOperationPrivate = async (query) => {
  const operations = await Operation.findAll({
    where: {
      [Op.or]: [
        { Code: query },
        { Name: query },
        { NameAR: query}
      ]
    },
    attributes: ['ID','Name','NameAr','Anesthetic','Description','DescriptionAR','Los', 'Code'],
  });

  const operationShare = await getOperationSharePrivate();

  for (let operation of operations) {
    const categoryPricing = await getCategoryPricingByOperationIdPrivate(operation.ID);
    operation.dataValues.categoryPricing = categoryPricing;
    const operationShareValue = operationShare[0].Share;
    console.log(operationShareValue);
    const categoryPricingValues = categoryPricing[0];
    // Then use operationShareValue instead of operationShare.Share
    operation.dataValues.patientShareCategory1 = categoryPricingValues.FirstCategory1 * operationShareValue/100;
    operation.dataValues.patientShareCategory2 = categoryPricingValues.FirstCategory2 * operationShareValue/100;
    operation.dataValues.patientShareCategory3 = categoryPricingValues.FirstCategory3 * operationShareValue/100;

    // Check the Anesthetic value and modify it if necessary
    if (operation.dataValues.Anesthetic === 'G') {
      operation.dataValues.Anesthetic = 'Global Anesthesia';
    } else if (operation.dataValues.Anesthetic === 'L') {
      operation.dataValues.Anesthetic = 'Local Anesthesia';
    }
  }

  return operations;
};

const searchOperationPublic = async (query) => {
  const operations = await Operation.findAll({
    where: {
      [Op.or]: [
        { Code: query },
        { Name: query },
        { NameAR: query}
      ]
    },
    attributes: ['ID','Name','NameAr','Anesthetic','Description', 'Code'],
  });

  const operationShare = await getOperationSharePublic();

  for (let operation of operations) {
    const categoryPricing = await getCategoryPricingByOperationIdPublic(operation.ID);
    operation.dataValues.categoryPricing = categoryPricing;
    const operationShareValue = operationShare[0].Share;
    console.log(operationShareValue);
    const categoryPricingValues = categoryPricing[0];
    // Then use operationShareValue instead of operationShare.Share
    operation.dataValues.patientShareCategory1 = categoryPricingValues.FirstCategory1 * operationShareValue/100;
    operation.dataValues.patientShareCategory2 = categoryPricingValues.FirstCategory2 * operationShareValue/100;
    operation.dataValues.patientShareCategory3 = categoryPricingValues.FirstCategory3 * operationShareValue/100;

    // Check the Anesthetic value and modify it if necessary
    if (operation.dataValues.Anesthetic === 'G') {
      operation.dataValues.Anesthetic = 'Global Anesthesia';
    } else if (operation.dataValues.Anesthetic === 'L') {
      operation.dataValues.Anesthetic = 'Local Anesthesia';
    }
  }

  return operations;
};

const searchOperationByHospitalName = async (hospitalName) => {
  const hospital = await Hospital.findOne({ where: { hospitalName } });
  console.log(hospital.isPrivate);
  if (!hospital) {
    throw new Error(`Hospital with name ${hospitalName} not found`);
  }


  const operations = await Operation.findAll({
    include: [
      {
        model: HospitalOperationMapping,
        where: { HospitalId: hospital.ID },
        attributes: ['OperationId'],
      },
    ],
  });


  for (let operation of operations) {
    if (hospital.isPrivate == false) {
      operation.dataValues.operationShare = await getOperationSharePublic();
      operation.dataValues.categoryPricing = await getCategoryPricingByOperationIdPublic(operation.ID);
    } else {
      operation.dataValues.categoryPricing = await getCategoryPricingByOperationIdPrivate(operation.ID);
      operation.dataValues.operationShare = await getOperationSharePrivate();
    }
    const operationShareValue = operation.dataValues.operationShare[0].Share;
  
    const categoryPricingValues1 =operation.dataValues.categoryPricing[0].FirstCategory1;
    const categoryPricingValues2 =operation.dataValues.categoryPricing[0].FirstCategory2;
    const categoryPricingValues3 =operation.dataValues.categoryPricing[0].FirstCategory3;

    // Then use operationShareValue instead of operationShare.Share
    operation.dataValues.patientShareCategory1 = categoryPricingValues1 * operationShareValue/100;
    operation.dataValues.patientShareCategory2 = categoryPricingValues2 * operationShareValue/100;
    operation.dataValues.patientShareCategory3 = categoryPricingValues3 * operationShareValue/100;

    // Check the Anesthetic value and modify it if necessary
    if (operation.dataValues.Anesthetic === 'G') {
      operation.dataValues.Anesthetic = 'Global Anesthesia';
    } else if (operation.dataValues.Anesthetic === 'L') {
      operation.dataValues.Anesthetic = 'Local Anesthesia';
    }
  }

  return operations;
};

const getOperationById = async (operationId) => {
  const operation = await Operation.findOne({
    where: { ID: operationId },
    attributes: ['ID','Name','NameAr','Anesthetic','Description','DescriptionAR','Los', 'Code'],
    include: [
      {
        model: CategoryPricing,
      },
     
    ],
  });

  if (!operation) {
    throw new Error(`Operation with ID ${operationId} not found`);
  }
  const operationSharePrivate = await getOperationSharePrivate();
  const operationSharePublic = await getOperationSharePublic();
  const categoryPricingPrivate = await getCategoryPricingByOperationIdPrivate(operationId);
  const categoryPricingPublic = await getCategoryPricingByOperationIdPublic(operationId);

  operation.dataValues.operationSharePrivate = operationSharePrivate;
  operation.dataValues.operationSharePublic = operationSharePublic;
  operation.dataValues.categoryPricingPrivate = categoryPricingPrivate;
  operation.dataValues.categoryPricingPublic = categoryPricingPublic;

  operation.dataValues.patientSharePrivateCategory1 = categoryPricingPrivate[0].FirstCategory1 * operationSharePrivate[0].Share/100;
  operation.dataValues.patientSharePrivateCategory2 = categoryPricingPrivate[0].FirstCategory2 * operationSharePrivate[0].Share/100;
  operation.dataValues.patientSharePrivateCategory3 = categoryPricingPrivate[0].FirstCategory3 * operationSharePrivate[0].Share/100;

  operation.dataValues.patientSharePublicCategory1 = categoryPricingPublic[0].FirstCategory1 * operationSharePublic[0].Share/100;
  operation.dataValues.patientSharePublicCategory2 = categoryPricingPublic[0].FirstCategory2 * operationSharePublic[0].Share/100;
  operation.dataValues.patientSharePublicCategory3 = categoryPricingPublic[0].FirstCategory3 * operationSharePublic[0].Share/100;

 if (operation.dataValues.Anesthetic === 'G') {
      operation.dataValues.Anesthetic = 'Global Anesthesia';
    } else if (operation.dataValues.Anesthetic === 'L') {
      operation.dataValues.Anesthetic = 'Local Anesthesia';
    }


  return operation;
};
const getCategoryPricingByOperationIdPrivate = async (operationId) => {
  const categoryPricing = await CategoryPricing.findAll({
    where: { OperationId: operationId },
    attributes: ['FirstCategory1', 'FirstCategory2', 'FirstCategory3'],
  });

  if (!categoryPricing) {
    throw new Error(`No category pricing found for operation with ID ${operationId}`);
  }

  return categoryPricing;
};

const getCategoryPricingByOperationIdPublic = async (operationId) => {
  const categoryPricing = await CategoryPricing.findAll({
    where: { OperationId: operationId },
    attributes: ['FirstCategory1', 'FirstCategory2', 'FirstCategory3'],
  });

  if (!categoryPricing) {
    throw new Error(`No category pricing found for operation with ID ${operationId}`);
  }

  return categoryPricing;
};
const getOperationSharePrivate = async () => {
  const operationShares = await OperationShare.findAll({
    where: { isPrivate: true },
    attributes: ['Share'],
  });

  if (!operationShares) {
    throw new Error(`No operation shares found for private operations`);
  }

  return operationShares;
};

const getOperationSharePublic = async () => {
  const operationShares = await OperationShare.findAll({
    where: { isPrivate: false },
    attributes: ['Share'],
  });

  if (!operationShares) {
    throw new Error(`No operation shares found for public operations`);
  }

  return operationShares;
};
const getAllHospitals = async () => {
  const hospitals = await Hospital.findAll();
  if (!hospitals) {
    throw new Error('No hospitals found');
  }
  return hospitals;
};

const getAllOperations = async () => {
  const operations = await Operation.findAll();
  if (!operations) {
    throw new Error('No operations found');
  }
  return operations;
};

const getAllOperationSystems = async () => {
  const operationSystems = await OperationSystems.findAll();
  if (!operationSystems) {
    throw new Error('No operation systems found');
  }
  return operationSystems;
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
};