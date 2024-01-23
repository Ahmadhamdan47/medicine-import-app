// src/services/drugService.js

const { Op } = require('sequelize');
const Drug = require('../models/Drug');

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

module.exports = {
  searchDrugByATCName,
  searchDrugByBrandName,
  getDrugByGuid,
  filterDrugs, // Export the new service function
};
