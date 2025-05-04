const { Op, fn, col } = require('sequelize');
const Drug = require('../models/drug');
const Manufacturer = require('../models/manufacturer');

const getStats = async () => {
  // total drugs count
  const totalDrugs = await Drug.count();

  // count group by Stratum
  const drugsByStratum = await Drug.findAll({
    attributes: ['Stratum', [fn('COUNT', col('Stratum')), 'count']],
    group: ['Stratum']
  });

  // drugs with Country = 'Lebanon'
  const drugsCountryLebanon = await Drug.count({ where: { Country: 'Lebanon' } });
  // drugs with Country !== 'Lebanon'
  const drugsCountryNotLebanon = await Drug.count({ where: { Country: { [Op.ne]: 'Lebanon' } } });

  // count distinct ATCRelatedIngredient
  const differentATCs = await Drug.aggregate('ATCRelatedIngredient', 'count', { distinct: true });

  // drugs with no alternative: here assumed when both ATCRelatedIngredient and DFSequence are null
  const drugsNoAlternative = await Drug.count({ where: { ATCRelatedIngredient: null, DFSequence: null } });

  // distinct manufacturer count from Manufacturer table
  const differentManufacturers = await Manufacturer.count(); // assuming each row is unique
  // lebanese manufacturers from Manufacturer table
  const lebaneseManufacturers = await Manufacturer.count({ where: { Country: 'Lebanon' } });

  // lowest and highest drug price
  const lowestDrugPrice = await Drug.min('Price');
  const highestDrugPrice = await Drug.max('Price');

  return {
    totalDrugs,
    drugsByStratum,
    drugsCountryLebanon,
    drugsCountryNotLebanon,
    differentATCs,
    drugsNoAlternative,
    differentManufacturers,
    lebaneseManufacturers,
    lowestDrugPrice,
    highestDrugPrice
  };
};

const getDrugsByManufacturer = async () => {
  // fetch all manufacturers then get drugs for each
  const manufacturers = await Manufacturer.findAll();
  const result = await Promise.all(manufacturers.map(async (manu) => {
    const drugs = await Drug.findAll({ where: { ManufacturerID: manu.id }, attributes: ['DrugName'] });
    return {
      manufacturer: manu.Name,
      drugNames: drugs.map(d => d.DrugName),
      drugCount: drugs.length
    };
  }));
  return result;
};

const getDrugsByCountry = async () => {
  // get distinct countries from Drug table
  const countries = await Drug.findAll({
    attributes: [
      'Country',
      [fn('COUNT', col('Country')), 'drugCount']
    ],
    group: ['Country']
  });
  // For each country, get list of drug names
  const result = await Promise.all(countries.map(async (country) => {
    const drugs = await Drug.findAll({
      where: { Country: country.Country },
      attributes: ['DrugName']
    });
    return {
      country: country.Country,
      drugNames: drugs.map(d => d.DrugName),
      drugCount: parseInt(country.dataValues.count, 10)
    };
  }));
  return result;
};

module.exports = {
  getStats,
  getDrugsByManufacturer,
  getDrugsByCountry
};
