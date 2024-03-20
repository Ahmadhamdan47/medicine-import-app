// src/services/drugService.js
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const Drug = require("../models/pharmacyDrug");
const PharmacyDrug = require("../models/pharmacyDrug");
const Drug_ATC_Mapping = require("../models/AtcMapping");
const ATC_Code = require("../models/ATC"); // Assuming you have a model for ATC_Code
const ATCService = require("./atcService");
const { v4: uuidv4 } = require("uuid");

const searchDrugByATCName = async (atcName) => {
  try {
    // Find the ATC code
    const atcCode = await ATC_Code.findOne({
      where: { ATCName: atcName },
    });

    if (!atcCode) {
      throw new Error(`ATC code not found: ${atcName}`);
    }

    // Find the mappings
    const mappings = await Drug_ATC_Mapping.findAll({
      where: { ATC_ID: atcCode.ATC_ID },
    });

    // Find the drugs and their corresponding ATC codes
    const drugs = await Promise.all(
      mappings.map(async (mapping) => {
        const drug = await Drug.findOne({
          where: { DrugID: mapping.DrugID },
          attributes: [
            "BrandName",
            "PriceForeign",
            "PublicPrice",
            "ImageDefault",
          ],
        });

        const atc = await ATCService.getATCByDrugID(mapping.DrugID);

        return {
          ...drug.get({ plain: true }), // Convert Sequelize instance to plain JavaScript object
          ATC: atc,
        };
      })
    );

    return drugs;
  } catch (error) {
    console.error(error);
    throw new Error("Error in drugService: " + error.message);
  }
};

const searchDrugByBrandName = async (query) => {
  try {
    const drugs = await Drug.findAll({
      where: {
        BrandName: { [Op.like]: `%${query}%` },
      },
      attributes: [
        "BrandName",
        "ATCName",
        "PriceUSD",
        "PriceLBP",
        "DosageName",
        "PresentationName",
        "FormName",
        "RouteName",
        "StratumTypeName",
        "CountryName",
        "ManufacturerName",
        "ImageDefault",
      ],
    });
    console.log(drugs);
    return drugs;
  } catch (error) {
    console.error(error);
    throw new Error("Error in drugService: " + error.message);
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
    throw new Error("Error in drugService: " + error.message);
  }
};
// src/services/drugService.js

const filterDrugs = async (drugs) => {
  try {
    const sortedDrugs = drugs.sort((a, b) =>
      a.BrandName.localeCompare(b.BrandName)
    );
    console.log(sortedDrugs);
    return sortedDrugs;
  } catch (error) {
    console.error(error);
    throw new Error("Error in drugService: " + error.message);
  }
};
const addDrug = async (drugData) => {
  try {
    // Convert UUID strings to the appropriate format
    drugData.CreatedBy = uuidv4();
    drugData.UpdatedBy = uuidv4();
    drugData.CurrencyForeign = uuidv4();

    const newDrug = await Drug.create(drugData);
    return newDrug;
  } catch (error) {
    console.error(error);
    throw new Error("Error in drugService: " + error.message);
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
      console.error("Validation error in pharmacyDrugService:", error);
      throw new Error(
        "Validation error in pharmacyDrugService: " + error.message
      );
    } else if (error instanceof Sequelize.DatabaseError) {
      // Handle database errors
      console.error("Database error in pharmacyDrugService:", error);
      throw new Error(
        "Database error in pharmacyDrugService: " + error.message
      );
    } else {
      // Handle any other errors
      console.error("Error in pharmacyDrugService:", error);
      throw new Error("Error in pharmacyDrugService: " + error.message);
    }
  }
};

const getAllDrugs = async () => {
  try {
    const drugs = await Drug.findAll({
      attributes: [
        "BrandName",
        "ATCName",
        "PriceUSD",
        "PriceLBP",
        "DosageName",
        "PresentationName",
        "FormName",
        "RouteName",
        "StratumTypeName",
        "CountryName",
        "ManufacturerName",
        "ImageDefault",
      ],
      logging: (query) => {
        if (!query || !query.sql) {
          return; // Exit early if the query or SQL string is undefined
        }

        logger.info(`Generated SQL Query: ${query.sql}`);
      },
    });
    return drugs;
  } catch (error) {
    console.error(error);
    throw new Error("Error in drugService: " + error.message);
  }
};

module.exports = {
  searchDrugByATCName,
  searchDrugByBrandName,
  getDrugByGuid,
  filterDrugs,
  addDrug,
  addPharmacyDrug,
  getAllDrugs,
};
