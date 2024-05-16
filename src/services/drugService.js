// src/services/drugService.js
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const Drug = require("../models/pharmacyDrug");
const PharmacyDrug = require("../models/pharmacyDrug");
const drug_atc_mapping = require("../models/atcmapping");
const ATC_Code = require("../models/atc"); // Assuming you have a model for ATC_Code
const ATCService = require("./atcService");
const { v4: uuidv4 } = require("uuid");
const Substitute = require('../models/substitute');
const DrugATCMapping = require('../models/atcmapping');
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
const BatchLotTracking = require('../models/BatchLot');
const BatchSerialNumber= require('../models/batchserialnumber');
const DiseaseCategory = require('../models/diseaseCategory');
const DiseaseCategoryATC = require('../models/diseaseCategoryAtc');
const axios = require('axios');


const getDrugByDiseaseCategory = async (categoryName) => {

  const diseaseCategory = await DiseaseCategory.findOne({ where: { CategoryName: categoryName } });
  const diseaseCategoryId = diseaseCategory.DiseaseCategoryId;
console.log(diseaseCategoryId);

  const diseaseCategoryAtc = await DiseaseCategoryATC.findOne({ where: { DiseaseCategoryId: diseaseCategoryId } });
  const atcId = diseaseCategoryAtc.ATC_CodeId;
  console.log(atcId);

 
 const drugIds = await drug_atc_mapping.findAll({
  where: {
    ATC_ID: {
      [Op.eq]: atcId
    }
  },
});

const drugs = await Drug.findAll({
  where: {
    DrugID: {
      [Op.in]: drugIds.map(drug => drug.DrugID)
    }
  },
  attributes: ['DrugName', 'DrugNameAR', 'ManufacturerID', 'ProductType', 'Price', 'ATCRelatedIngredient', 'ImagesPath', 'SubsidyPercentage','NotMarketed'],
});

const drugsWithDosageAndRoute = await Promise.all(drugs.map(async (drug) => {
  const dosage = await getDosageByDrugName(drug.DrugName);
  const route = await getRouteByDrugName(drug.DrugName);
  const presentation = await getPresentationByDrugName(drug.DrugName);
  const Manufacturer = await Agent.findOne({ where: { AgentID: drug.ManufacturerID } });
  const ManufacturerName = Manufacturer.AgentName;
  const CountryName = Manufacturer.Country;
  const priceInLBP = drug.Price * 90000;
  const unitPrice = drug.Price / presentation.Amount;
  const unitPriceInLBP = unitPrice * 90000;

  return {
    ...drug.dataValues,
    dosage,
    route,
    presentation,
    ManufacturerName,
    CountryName,
    priceInLBP,
    unitPrice,
    unitPriceInLBP
  };
}));

return drugsWithDosageAndRoute;
};  



const searchDrugByATCName = async (atcName) => {
  try {
    const drugs = await Drug.findAll({
      where: {
        ATCRelatedIngredient: {
          [Op.like]: `%${atcName}%`
        }
      },
      attributes: ['DrugName', 'DrugNameAR', 'ManufacturerID', 'ProductType', 'Price', 'ATCRelatedIngredient', 'ImagesPath', 'SubsidyPercentage','NotMarketed'],

    });

    const drugsWithDosageAndRoute = await Promise.all(drugs.map(async (drug) => {
      const dosage = await getDosageByDrugName(drug.DrugName);
      const route = await getRouteByDrugName(drug.DrugName);
      const presentation = await getPresentationByDrugName(drug.DrugName);
      const Manufacturer = await Agent.findOne({ where: { AgentID: drug.ManufacturerID } });
      const ManufacturerName = Manufacturer.AgentName;
      const CountryName = Manufacturer.Country;
      const priceInLBP = drug.Price * 90000;
      const unitPrice = drug.Price / presentation.Amount;
      const unitPriceInLBP = unitPrice * 90000;

      return {
        ...drug.dataValues,
        dosage,
        route,
        presentation,
        ManufacturerName,
        CountryName,
        priceInLBP,
        unitPrice,
        unitPriceInLBP
      };
    }));

    return drugsWithDosageAndRoute;
  } catch (error) {
    console.error("Error in searchDrugByATCName:", error);
    throw new Error('Error occurred in searchDrugByATCName: ' + error.message);
  }
};
const searchDrugByName = async (query) => {
  try {
    const drugs = await Drug.findAll({
      where: {
        DrugName: { [Op.like]: `%${query}%` },
        
      },
      attributes: ['DrugName', 'DrugNameAR', 'ManufacturerID', 'ProductType', 'Price', 'ATCRelatedIngredient', 'ImagesPath', 'SubsidyPercentage','NotMarketed'],

    });

    const drugsWithDosageAndRoute = await Promise.all(drugs.map(async (drug) => {
      const dosage = await getDosageByDrugName(drug.DrugName);
      const route = await getRouteByDrugName(drug.DrugName);
      const presentation = await getPresentationByDrugName(drug.DrugName);
      const Manufacturer = await Agent.findOne({ where: { AgentID: drug.ManufacturerID } });
      const ManufacturerName = Manufacturer.AgentName;
      const CountryName = Manufacturer.Country;
      const priceInLBP = drug.Price * 90000;
      const unitPrice = drug.Price / presentation.Amount;
      const unitPriceInLBP = unitPrice * 90000;

      return {
        ...drug.dataValues,
        dosage,
        route,
        presentation,
        ManufacturerName,
        CountryName,
        priceInLBP,
        unitPrice,
        unitPriceInLBP
      };
    }));

    return drugsWithDosageAndRoute;
  } catch (error) {
    console.error("Error in searchDrugByATCName:", error);
    throw new Error('Error occurred in searchDrugByATCName: ' + error.message);
  }
};
const getDrugById = async (DrugID) => {
  try {
    const drug = await Drug.findOne({
      where: {
        DrugID: DrugID,
      },
      attributes: ["DrugName","DrugNameAr","isOTC", "ATCRelatedIngredient", "ProductType","SubsidyPercentage","MoPHCode","Price","imagesPath",'ManufacturerID','RegistrationNumber','NotMarketed','ImagesPath'],

    });
    const dosage = await getDosageByDrugId(DrugID);
    const route = await getRouteByDrugId(DrugID);
    const presentation = await getPresentationByDrugId(DrugID);
    const ATC = await ATCService.getATCByDrugID(DrugID);
    const priceInLBP = drug.Price * 90000;
    const unitPrice = drug.Price / presentation.Amount;
    const unitPriceInLBP = unitPrice * 90000;
    const Manufacturer = await Agent.findOne({ where: { AgentID: drug.ManufacturerID } });
    const ManufacturerName = Manufacturer.AgentName;
    const AgentName = Manufacturer.AgentName;
    const CountryName = Manufacturer.Country;
    const stratum = await getStratumByDrugId(DrugID);
    const imagesPath = drug.imagesPath;

    const allDrugData = { ...drug.get({ plain: true }), dosage, route, presentation, priceInLBP, unitPriceInLBP, unitPrice,imagesPath,stratum,ATC,ManufacturerName,CountryName,AgentName};
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

    const drugs = await Drug.findAll({
      attributes: ['DrugName', 'DrugNameAR', 'ManufacturerID', 'ProductType', 'Price', 'ATCRelatedIngredient', 'ImagesPath', 'SubsidyPercentage','NotMarketed'],
    });
    
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
      const Manufacturer = await Agent.findOne({ where: { AgentID: drug.ManufacturerID } });
      const ManufacturerName = Manufacturer.AgentName;
      const CountryName = Manufacturer.Country;
      const priceInLBP = drug.Price * 90000;
      const unitPrice = drug.Price / presentation.Amount;
      const unitPriceInLBP = unitPrice * 90000;
      
      return { ...drug.get({ plain: true }), dosage, route, presentation, priceInLBP, unitPriceInLBP, unitPrice, ManufacturerName, CountryName};
    }));

    if (drugId) {
      try {
        const substitutes = await Substitute.findAll({
          where: { DrugID: drugId },
          include: Drug,
          attributes: ['DrugName', 'DrugNameAR', 'isOTC', 'ManufacturerID', 'RegistrationNumber', 'ProductType', 'Price', 'ATCRelatedIngredient', 'ImagesPath', 'SubsidyPercentage'],

          
        });
    
        if (substitutes.length > 0) {
          console.log("Substitutes found:", substitutes); // Log the substitutes found
    
          const substitutesWithDosageAndRoute = await Promise.all(substitutes.map(async (substitute) => {
            const dosage = await getDosageByDrugName(drug.DrugName);
            const route = await getRouteByDrugName(drug.DrugName);
            const presentation = await getPresentationByDrugName(drug.DrugName);
            const Manufacturer = await Agent.findOne({ where: { AgentID: drug.ManufacturerID } });
            const ManufacturerName = Manufacturer.AgentName;
            const CountryName = Manufacturer.Country;
            const priceInLBP = drug.Price * 90000;
            const unitPrice = drug.Price / presentation.Amount;
            const unitPriceInLBP = unitPrice * 90000;
            
            return { ...drug.get({ plain: true }), dosage, route, presentation, priceInLBP, unitPriceInLBP, unitPrice, ManufacturerName, CountryName};
          }));
    
          drugsWithDosageAndRoute.push(...substitutesWithDosageAndRoute);
        }
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
const getDrugByATCLevel = async (query) => {
  try {
    // Fetch all ATC codes that start with the provided query
    const atcCodes = await ATC_Code.findAll({
      where: {
        Code: {
          [Op.like]: `${query}%`
        }
      }
    });
    console.log(atcCodes);

    // Extract ATC_IDs from the fetched ATC codes
    const atcIds = atcCodes.map(atcCode => atcCode.ATC_ID);

    // Fetch all drugs that have the corresponding ATC_IDs
    const drugs = await drug_atc_mapping.findAll({
      where: {
        ATC_ID: {
          [Op.in]: atcIds
        }
      },
      include: [{
        model: Drug,
        attributes: ['DrugID','DrugName', 'DrugNameAR', 'ManufacturerID', 'ProductType', 'Price', 'ATCRelatedIngredient', 'ImagesPath', 'SubsidyPercentage','NotMarketed'],
      }]
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
      attributes:['DosageId','Numerator','NumeratorUnit']
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
      attributes: ['Child'],
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
      attributes :['Amount','PackageType','TypeId']
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
    const { StratumTypeId } = drugStratum;

    // Get the stratumCode from the StratumType table
    const stratumType = await StratumType.findOne({
      where: {
        stratumTypeId: StratumTypeId,
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

const checkMate = async (GTIN,BatchNumber,SerialNumber,ExpiryDate) => {
  console.log(GTIN.GTIN);
  console.log(GTIN.BatchNumber);
  try {
    // Check if the GTIN exists in the Drug table
    const drug = await Drug.findOne({
      where: { GTIN: GTIN.GTIN }
    });

    if (!drug) {
      return 'Checkmate';
    }

    // Check if the BatchNumber exists in the BatchLot table
    const batchLot = await BatchLotTracking.findOne({
      where: { 
        DrugId: drug.DrugID,
        BatchNumber: GTIN.BatchNumber
      }
    });

    if (!batchLot) {
      return 'Checkmate';
    }

    // Check if the SerialNumber exists for this batch in the BatchSerialNumber table
    const batchSerialNumber = await BatchSerialNumber.findOne({
      where: { 
        BatchId: batchLot.BatchLotId,
        SerialNumber: GTIN.SerialNumber
      }
    });

    if (!batchSerialNumber) {
      return 'Checkmate';
    }

    // If all checks pass, return a success message
    return 'Approved';
  } catch (error) {
    console.error('Error in checkMate:', error);
    throw error;
  }
};


const getOTCDrugs = async () => {
  try {
    const drugs = await Drug.findAll({
      where: {
        isOTC: true
      },
      attributes: ['DrugName', 'DrugNameAR', 'ManufacturerID', 'ProductType', 'Price', 'ATCRelatedIngredient', 'ImagesPath', 'SubsidyPercentage','NotMarketed'],
    });

    const drugsWithDosageAndRoute = await Promise.all(drugs.map(async (drug) => {
      const dosage = await getDosageByDrugName(drug.DrugName);
      const route = await getRouteByDrugName(drug.DrugName);
      const presentation = await getPresentationByDrugName(drug.DrugName);
      const Manufacturer = await Agent.findOne({ where: { AgentID: drug.ManufacturerID } });
      const ManufacturerName = Manufacturer.AgentName;
      const CountryName = Manufacturer.Country;
      const priceInLBP = drug.Price * 90000;
      const unitPrice = drug.Price / presentation.Amount;
      const unitPriceInLBP = unitPrice * 90000;

      return {
        ...drug.dataValues,
        dosage,
        route,
        presentation,
        ManufacturerName,
        CountryName,
        priceInLBP,
        unitPrice,
        unitPriceInLBP
      };
    }));

    return drugsWithDosageAndRoute;
  } catch (error) {
    console.error("Error in getOTCDrugs:", error);
    throw new Error('Error occurred in getOTCDrugs: ' + error.message);
  }
};
const getDrugSubstitutes = async (drugName) => {
  try {
    // Find the drug by its name
    const drug = await Drug.findOne({
      where: { DrugName: drugName },
    });

    if (!drug) {
      throw new Error(`Drug with name ${drugName} not found`);
    }

    // Get the substitutes of the drug
    const substitutes = await substituteService.getSubstitutesByDrugID(drug.DrugID);

    // Fetch the data of the substitutes like in the smartSearch
    const substitutesWithDetails = await Promise.all(substitutes.map(async (substitute) => {
      const substituteDrug = await Drug.findOne({
        where: { DrugID: substitute.Substitute },
        attributes: ['DrugName', 'DrugNameAR', 'ManufacturerID', 'ProductType', 'Price', 'ATCRelatedIngredient', 'ImagesPath', 'SubsidyPercentage','NotMarketed'],
      });

      // Fetch additional details for the substitute drug
      const dosage = await getDosageByDrugName(substituteDrug.DrugName);
      const route = await getRouteByDrugName(substituteDrug.DrugName);
      const presentation = await getPresentationByDrugName(substituteDrug.DrugName);
      const Manufacturer = await Agent.findOne({ where: { AgentID: substituteDrug.ManufacturerID } });
      const ManufacturerName = Manufacturer.AgentName;
      const CountryName = Manufacturer.Country;
      const priceInLBP = substituteDrug.Price * 90000;
      const unitPrice = substituteDrug.Price / presentation.Amount;
      const unitPriceInLBP = unitPrice * 90000;

      return {
        ...substituteDrug.dataValues,
        dosage,
        route,
        presentation,
        ManufacturerName,
        CountryName,
        priceInLBP,
        unitPrice,
        unitPriceInLBP
      };
    }));

    return substitutesWithDetails;
  } catch (error) {
    console.error("Error in getDrugSubstitutes:", error);
    throw new Error('Error occurred in getDrugSubstitutes: ' + error.message);
  }
};
const checkDrugNameInAPI = async (drugName) => {
  try {
    const response = await axios.get(`https://data.instamed.fr/api/drugs?page=1&_per_page=30&name=${drugName}`);
    return response.data['hydra:totalItems'] > 0;
  } catch (error) {
    console.error(error);
    return false;
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
  checkMate,
  getOTCDrugs,
  getDrugByDiseaseCategory,
  getDrugSubstitutes,
  checkDrugNameInAPI
  
};
