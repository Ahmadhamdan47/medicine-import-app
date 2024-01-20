// src/services/drugService.js

const Drug = require('./models/Drug');

const searchDrug = async (query) => {
  try {
    const drugs = await Drug.findAll({
      where: {
        name: {
          [Op.iLike]: `%${query}%`, // Case-insensitive search
        },
      },
    });
    return drugs;
  } catch (error) {
    throw new Error('Error in drugService: ' + error.message);
  }
};

module.exports = {
  searchDrug,
};
