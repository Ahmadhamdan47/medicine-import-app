// src/services/drugService.js
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const Drug = require("../models/pharmacyDrug");
const PharmacyDrug = require("../models/pharmacyDrug");
const Drug_ATC_Mapping = require("../models/atcMapping");
const ATC_Code = require("../models/atc"); // Assuming you have a model for ATC_Code
const ATCService = require("./atcService");
const { v4: uuidv4 } = require("uuid");
const Substitute = require('../models/substitute');
const DrugATCMapping = require('../models/atcMapping');
const substituteService = require('./substituteService');
const Dosage = require('../models/dosage');
const DosageForm= require('../models/dosageForm');
const DosageFormMapping = require('../models/dosageFormMapping');
const DrugRoute = require('../models/drugRoute');
const Agent = require('../models/agent');
const Route = require('../models/route');
const PresentationType = require('../models/presentationType');
const DrugPresentation = require('../models/drugPresentation');
const StratumType = require('../models/stratumType');
const DrugStratum = require('../models/drugStratum');
const Fuse = require('fuse.js');
const searchDrugByATCName = async (query) => {
  try {
    const drugs = await Drug.findAll({
      where: {
        ATCRelatedIngredient: { [Op.like]: `%${query}%` },
        attributes: ["DrugName", "ATCRelatedIngredient", "ProductType", "Price", "ImageDefault","SubsidyPercentage", "ManufacturerID","imagesPath"],
      },
    });

    const drugsWithDosageAndRoute = await Promise.all(drugs.map(async (drug) => {
      const dosage = await getDosageByDrugName(drug.DrugName);
      const route = await getRouteByDrugName(drug.DrugName);
      const presentation= await getPresentationByDrugName(drug.DrugName);
      const priceInLBP = drug.Price * 90000;
      const unitPrice = drug.Price / presentation.Amount;
      const unitPriceInLBP = unitPrice * 90000;
      const imagesPath = drug.imagesPath;
      return { ...drug.get({ plain: true }), dosage, route, presentation, priceInLBP, unitPriceInLBP, unitPrice,imagesPath};
    }));

    return drugsWithDosageAndRoute;
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
      attributes: ["DrugName", "ATCRelatedIngredient", "ProductType", "Price", "ImageDefault","SubsidyPercentage","imagesPath"],
    });
    console.log(drugs);
    const drugsWithDosageAndRoute = await Promise.all(drugs.map(async (drug) => {
      const dosage = await getDosageByDrugName(drug.DrugName);
      const route = await getRouteByDrugName(drug.DrugName);
      const presentation = await getPresentationByDrugName(drug.DrugName);
      const priceInLBP = drug.Price * 90000;
      const unitPrice = drug.Price / presentation.Amount;
      const unitPriceInLBP = unitPrice * 90000;
      const imagesPath = drug.imagesPath; 
      return { ...drug.get({ plain: true }), dosage,route,presentation, priceInLBP, unitPriceInLBP, unitPrice,imagesPath};
    }));
    return drugsWithDosageAndRoute;
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
      attributes: ["DrugName", "ATCRelatedIngredient", "ProductType", "ImageDefault","SubsidyPercentage","MoPHCode","Price","imagesPath"],

    });
    const dosage = await getDosageByDrugId(DrugID);
    const route = await getRouteByDrugId(DrugID);
    const presentation = await getPresentationByDrugId(DrugID);
    const ATC = await ATCService.getATCByDrugID(DrugID);
    const priceInLBP = drug.Price * 90000;
    const unitPrice = drug.Price / presentation.Amount;
    const unitPriceInLBP = unitPrice * 90000;
    const Stratum= await getStratumByDrugId(DrugID);
    const imagesPath = drug.imagesPath;

    const allDrugData = { ...drug.get({ plain: true }), dosage, route, presentation,ATC, priceInLBP, unitPriceInLBP, unitPrice,Stratum,imagesPath};
    return allDrugData;
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
      // attributes: [
      //   "BrandName",
      //   "ATCName",
      //   "PriceUSD",
      //   "PriceLBP",
      //   "DosageName",
      //   "PresentationName",
      //   "FormName",
      //   "RouteName",
      //   "StratumTypeName",
      //   "CountryName",
      //   "ManufacturerName",
      //   "ImageDefault",
      // ],
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

    const drugs = await Drug.findAll();

    const options = {
      keys: ['DrugName', 'ATCRelatedIngredient','GTIN'],
      includeScore: true,
      threshold: 0.3,  // Adjust this value to change the sensitivity of the search
      isCaseSensitive: false
    };

    const fuse = new Fuse(drugs, options);
    const results = fuse.search(query);

    let drugId;
    if (results.some(result => result.item.DrugName === query || result.item.GTIN === query)) {
      const drug = results.find(result => result.item.DrugName === query || result.item.GTIN === query);
      drugId = drug.item.DrugID;
    }

    const drugsWithDosageAndRoute = await Promise.all(results.map(async (result) => {
      const drug = result.item;
      const dosage = await getDosageByDrugName(drug.DrugName);
      const route = await getRouteByDrugName(drug.DrugName);
      const presentation = await getPresentationByDrugName(drug.DrugName);
      const priceInLBP = drug.Price * 90000;
      const unitPrice = drug.Price / presentation.Amount;
      const unitPriceInLBP = unitPrice * 90000;
      const imagesPath = drug.imagesPath;
      return { ...drug.get({ plain: true }), dosage, route, presentation, priceInLBP, unitPriceInLBP, unitPrice,imagesPath };
    }));

    if (drugId) {
      try {
        const substitutes = await Substitute.findAll({
          where: { DrugID: drugId },
          include: Drug
        });

        console.log("Substitutes found:", substitutes); // Log the substitutes found

        const substitutesWithDosageAndRoute = await Promise.all(substitutes.map(async (substitute) => {
          const dosage = await getDosageByDrugName(substitute.DrugName);
          const route = await getRouteByDrugName(substitute.DrugName);
          const presentation = await getPresentationByDrugName(substitute.DrugName);
          const priceInLBP = substitute.Price * 90000;
          const unitPrice = substitute.Price / presentation.Amount;
          const unitPriceInLBP = unitPrice * 90000;
          return { ...substitute.get({ plain: true }), dosage, route, presentation, priceInLBP, unitPriceInLBP, unitPrice };
        }));

        drugsWithDosageAndRoute.push(...substitutesWithDosageAndRoute);
      } catch (error) {
        console.error("No substitutes found for drug:", error);
      }
    }

    return drugsWithDosageAndRoute;
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
const getDosageByDrugId = async (DrugID) => {
  try {
    const dosage = await Dosage.findOne({
      where: { DrugID: DrugID },
    });

    if (!dosage) {
      throw new Error(`No dosage found for drug ID: ${DrugID}`);
    }

    const dosageFormMapping = await DosageFormMapping.findOne({
      where: { DosageID: dosage.DosageId },
    });

    if (!dosageFormMapping) {
      throw new Error(`No dosage form mapping found for dosage ID: ${dosage.DosageId}`);
    }

    const dosageForm = await DosageForm.findOne({
      where: { DosageFormID: dosageFormMapping.DosageFormId },
    });

    if (!dosageForm) {
      throw new Error(`No dosage form found for ID: ${dosageFormMapping.DosageFormId}`);
    }

    return { dosage, dosageForm };
  } catch (error) {
    console.error("Error in getDosageByDrugId:", error);
    throw new Error('Error occurred in getDosageByDrugId: ' + error.message);
  }
};

const getDosageByDrugName = async (DrugName) => {
  try {
    const drug = await Drug.findOne({
      where: { DrugName: DrugName },
    });

    if (!drug) {
      throw new Error(`No drug found with name: ${DrugName}`);
    }

    return getDosageByDrugId(drug.DrugID);
  } catch (error) {
    console.error("Error in getDosageByDrugName:", error);
    throw new Error('Error occurred in getDosageByDrugName: ' + error.message);
  }
};

const getRouteByDrugId = async (DrugID) => {
  try {
    const drugRoute = await DrugRoute.findOne({
      where: { DrugID: DrugID },
    });

    if (!drugRoute) {
      throw new Error(`No route found for drug ID: ${DrugID}`);
    }

    const route = await Route.findOne({
      where: { RouteID: drugRoute.RouteId },
      attributes: ['Name'],
    });

    if (!route) {
      throw new Error(`No route name found for RouteID: ${drugRoute.RouteId}`);
    }

    return route;
  } catch (error) {
    console.error("Error in getRouteByDrugId:", error);
    throw new Error('Error occurred in getRouteByDrugId: ' + error.message);
  }
};

const getRouteByDrugName = async (DrugName) => {
  try {
    const drug = await Drug.findOne({
      where: { DrugName: DrugName },
    });

    if (!drug) {
      throw new Error(`No drug found with name: ${DrugName}`);
    }

    return getRouteByDrugId(drug.DrugID);
  } catch (error) {
    console.error("Error in getRouteByDrugName:", error);
    throw new Error('Error occurred in getRouteByDrugName: ' + error.message);
  }
};

const getPresentationByDrugId = async (DrugID) => {
  try {
    const drugPresentation = await DrugPresentation.findOne({
      where: { DrugId: DrugID },
    });

    if (!drugPresentation) {
      throw new Error(`No presentation found for drug ID: ${DrugID}`);
    }

    const presentationType = await PresentationType.findOne({
      where: { PresentationTypeId: drugPresentation.TypeId },
      attributes: ['Name'],
    });

    if (!presentationType) {
      throw new Error(`No presentation type found for ID: ${drugPresentation.TypeId}`);
    }

    return { ...drugPresentation.get({ plain: true }), presentationType };
  } catch (error) {
    console.error("Error in getPresentationByDrugId:", error);
    throw new Error('Error occurred in getPresentationByDrugId: ' + error.message);
  }
};

const getPresentationByDrugName = async (DrugName) => {
  try {
    const drug = await Drug.findOne({
      where: { DrugName: DrugName },
    });

    if (!drug) {
      throw new Error(`No drug found with name: ${DrugName}`);
    }

    return getPresentationByDrugId(drug.DrugID);
  } catch (error) {
    console.error("Error in getPresentationByDrugName:", error);
    throw new Error('Error occurred in getPresentationByDrugName: ' + error.message);
  }
};

const getStratumByDrugId = async (DrugID) => {
  try {
    // Find the corresponding mapping in the drugStratum table
    const drugStratum = await DrugStratum.findOne({
      where: {
        DrugID: DrugID,
      },
    });

    if (!drugStratum) {
      throw new Error(`No stratum mapping found for DrugID: ${DrugID}`);
    }

    // Get the stratumTypeId from the drugStratum
    const { stratumTypeId } = drugStratum;

    // Get the stratumCode from the StratumType table
    const stratumType = await StratumType.findOne({
      where: {
        id: stratumTypeId,
      },
    });

    if (!stratumType) {
      throw new Error(`No StratumType found for id: ${stratumTypeId}`);
    }

    // Return the stratumCode
    return stratumType.Code;
  } catch (error) {
    throw new Error("Error in drugService: " + error.message);
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
  addDrugATC,
  getDosageByDrugId,
  getDosageByDrugName,
  getRouteByDrugId,
  getRouteByDrugName,
  getPresentationByDrugId,
  getPresentationByDrugName,
};
