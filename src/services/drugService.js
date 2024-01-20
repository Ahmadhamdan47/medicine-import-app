// src/services/drugService.js

const { Op } = require('sequelize');
const Drug = require('../models/Drug');

const searchDrug = async (query) => {
  try {
    const drugs = await Drug.findAll({
      where: {
        [Op.or]: [
          { ATCName: { [Op.iLike]: `%${query}%` } },
          { BrandName: { [Op.iLike]: `%${query}%` } },
          { DrugLabelName : { [Op.iLike]: `%${query}%` } },
          // Add more search criteria as needed

        ],
      },
    });
    return drugs;
  } catch (error) {
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

module.exports = {
  searchDrug,
  getDrugByGuid,
};
