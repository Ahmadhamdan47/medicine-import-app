// src/services/drugService.js
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const Drug = require('../models/Drug');
const PharmacyDrug = require('../models/pharmacyDrug');

const searchDrugByATCName = async (query) => {
  try {
    const drugs = await Drug.findAll({
      where: {
        ATCName: { [Op.like]: `%${query}%` }
      },
      attributes: ['BrandName', 'ATCName', 'PriceUSD', 'PriceLBP', 'DosageName', 'PresentationName', 'FormName', 'RouteName', 'StratumTypeName', 'CountryName', 'ManufacturerName', 'ImageDefault']
    });
    console.log(drugs);
    return drugs;
  } catch (error) {
    console.error(error);
    throw new Error('Error in drugService: ' + error.message);
  }
};

const searchDrugByBrandName = async (query) => {
  try {
    const drugs = await Drug.findAll({
      where: {
        BrandName: { [Op.like]: `%${query}%` }
      },
      attributes: ['BrandName', 'ATCName', 'PriceUSD', 'PriceLBP', 'DosageName', 'PresentationName', 'FormName', 'RouteName', 'StratumTypeName', 'CountryName', 'ManufacturerName', 'ImageDefault']
    });
    console.log(drugs);
    return drugs;
  } catch (error) {
    console.error(error);
    throw new Error('Error in drugService: ' + error.message);
  }
};

const getDrugByGuid = async (guid) => {
  try {
    const drug = await Drug.findOne({
      where: {
        Guid: guid,
      },
    });
    return drug;
  } catch (error) {
    throw new Error('Error in drugService: ' + error.message);
  }
};
// src/services/drugService.js

const filterDrugs = async (drugs) => {
  try {
    const sortedDrugs = drugs.sort((a, b) => a.BrandName.localeCompare(b.BrandName));
    console.log(sortedDrugs);
    return sortedDrugs;
  } catch (error) {
    console.error(error);
    throw new Error('Error in drugService: ' + error.message);
  }
};
const addDrug = async (drugData) => {
  try {
    const newDrug = await Drug.create(drugData);
    return newDrug;
  } catch (error) {
    console.error(error);
    throw new Error('Error in drugService: ' + error.message);
  }
};
const addPharmacyDrug = async (drugData) => {
  try {
    const newDrug = await PharmacyDrug.create(drugData);
    console.log(newDrug);
    return newDrug;
  } catch (error) {
  console.error(error);

  if (error instanceof Sequelize.ValidationError) {
    // Handle validation errors
    console.error('Validation error in pharmacyDrugService:', error);
    throw new Error('Validation error in pharmacyDrugService: ' + error.message);
  } else if (error instanceof Sequelize.DatabaseError) {
    // Handle database errors
    console.error('Database error in pharmacyDrugService:', error);
    throw new Error('Database error in pharmacyDrugService: ' + error.message);
  } else {
    // Handle any other errors
    console.error('Error in pharmacyDrugService:', error);
    throw new Error('Error in pharmacyDrugService: ' + error.message);
  }
}
};
module.exports = {
  searchDrugByATCName,
  searchDrugByBrandName,
  getDrugByGuid,
  filterDrugs, 
  addDrug,
  addPharmacyDrug
};
