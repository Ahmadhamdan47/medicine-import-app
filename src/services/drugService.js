// src/services/drugService.js
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const Drug = require("../models/pharmacyDrug");
const PharmacyDrug = require("../models/pharmacyDrug");
const Drug_ATC_Mapping = require("../models/AtcMapping");
const ATC_Code = require("../models/ATC"); // Assuming you have a model for ATC_Code
const ATCService = require("./atcService");
const { v4: uuidv4 } = require("uuid");
const Substitute = require('../models/substitute');
const DrugATCMapping = require('../models/AtcMapping');
const substituteService = require('./substituteService');

const searchDrugByATCName = async (Name) => {
  try {
    // Find the ATC code
    const atcCode = await ATC_Code.findOne({
      where: { Name: Name },
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
            "DrugName",
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

const searchDrugByName = async (query) => {
  try {
    const drugs = await Drug.findAll({
      where: {
        DrugName: { [Op.like]: `%${query}%` },
      },
    });
    console.log(drugs);
    return drugs;
  } catch (error) {
    console.error(error);
    throw new Error("Error in drugService: " + error.message);
  }
};
const getDrugById = async (DrugID) => {
  try {
    const drug = await Drug.findOne({
      where: {
        DrugID: DrugID,
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
      a.DrugName.localeCompare(b.DrugName)
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
    });
    return drugs;
  } catch (error) {
    console.error("Error fetching drugs:", error);
    throw new Error("Failed to fetch drugs");
  }
};



const smartSearch = async (query) => {
  
  try {
    console.log("Query:", query); // Log the query

    const drugs = await Drug.findAll({
      where: {
        [Op.or]: [
          { DrugName: { [Op.like]: `%${query}%` } },
          { ATCRelatedIngredient: { [Op.like]: `%${query}%` } },
        ],
      },
    });

    console.log("Drugs found:", drugs); // Log the drugs found

    if (drugs.some(drug => drug.DrugName === query)) {
      const drugId = drugs.find(drug => drug.DrugName === query).DrugID;

      try {
        const substitutes = await Substitute.findAll({
          where: { DrugID: drugId },
          include: Drug
        });

        console.log("Substitutes found:", substitutes); // Log the substitutes found

        drugs.push(...substitutes.map(sub => sub.Drug));
      } catch (error) {
        console.error("No substitutes found for drug:", error);
      }
    }

    return drugs;
  } catch (error) {
    console.error("Error in smartSearch:", error);
    throw new Error('Error occurred in smartSearch: ' + error.message);
  }

};
const getDrugByATCLevel = async (atcCode) => {
  try {
      const drugs = await Drug.findAll({
          where: {
              ATCCode: {
                  [Op.like]: `${atcCode}%`
              }
          }
      });
      return drugs;
  } catch (error) {
      console.error(error);
      throw error;
  }
};

const addDrugATC = async (DrugID, ATC_ID) => {
  try {
      // Create a new mapping
      const mapping = await DrugATCMapping.create({
          DrugID: DrugID,
          ATC_ID: ATC_ID
      });
      const sameATCDrugs = await DrugATCMapping.findAll({
        where: { ATC_ID: ATC_ID }
    });
    for (let drug of sameATCDrugs) {
      if (drug.DrugID !== DrugID) {
          await substituteService.addSubstitute(DrugID, drug.DrugID);
          await substituteService.addSubstitute(drug.DrugID, DrugID);
      }
  }
      return mapping;
  } catch (error) {
      console.error("Error in addDrugATC:", error);
      throw error;
  }
};

module.exports = {
  searchDrugByATCName,
  searchDrugByName,
  smartSearch,
  getDrugById,
  filterDrugs,
  addDrug,
  addPharmacyDrug,
  getAllDrugs,
  getDrugByATCLevel,
  addDrugATC
};