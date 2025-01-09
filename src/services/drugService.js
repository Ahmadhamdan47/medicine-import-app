// src/services/drugService.js
const Sequelize = require("sequelize");
const { sequelize } = require('../../config/databasePharmacy'); // Adjust the path to your sequelize configuration

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
const BatchLotTracking = require('../models/batchLot');
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
  attributes: [
    'DrugName', 'DrugNameAR', 'ManufacturerID', 'ProductType', 'Price', 'ATCRelatedIngredient', 'ImagesPath', 
    'SubsidyPercentage', 'NotMarketed',  'DrugID', 'isOTC', 'RegistrationNumber', 'Substitutable', 'Amount',
    'Dosage', 'Form','Route', 'Presentation', 'Agent', 'Manufacturer', 'Country','MoPHCode'
  ],
});

const drugsWithDosageAndRoute = drugs.map(drug => {
  const dosage = drug.Dosage;
  const route = drug.Route; // Assuming 'Form' corresponds to 'route'
  const form = drug.Form;
  const presentation = drug.Presentation;
  const ManufacturerName = drug.Manufacturer;
  const CountryName = drug.Country;
  const priceInLBP = drug.Price * 89500;
  const unitPrice = drug.dataValues.Amount ? drug.Price / drug.dataValues.Amount : null;
  const unitPriceInLBP = unitPrice ? unitPrice * 89500 : null;

  return {
    ...drug.dataValues,
    dosage,
    route,
    form,
    presentation,
    ManufacturerName,
    CountryName,
    priceInLBP,
    unitPrice,
    unitPriceInLBP
  };
});
return drugsWithDosageAndRoute;
};


const searchDrugByATCName = async (atcName) => {
  try {
    const drugs = await Drug.findAll({
      where: {
        DrugID: {
          [Op.in]: drugIds.map(drug => drug.DrugID)
        }
      },
      attributes: [
        'DrugName', 'DrugNameAR', 'ManufacturerID', 'ProductType', 'Price', 'ATCRelatedIngredient', 'ImagesPath', 
        'SubsidyPercentage', 'NotMarketed',  'DrugID', 'isOTC', 'RegistrationNumber', 'Substitutable', 'Amount',
        'Dosage', 'Form','Route', 'Presentation', 'Agent', 'Manufacturer', 'Country', 'MoPHCode'
      ],
    });
  
    const drugsWithDosageAndRoute = drugs.map(drug => {
      const dosage = drug.Dosage;
      const route = drug.Route; // Assuming 'Form' corresponds to 'route'
      const form = drug.Form;
      const presentation = drug.Presentation;
      const ManufacturerName = drug.Manufacturer;
      const CountryName = drug.Country;
      const priceInLBP = drug.Price * 89500;
      const unitPrice = drug.dataValues.Amount ? drug.Price / drug.dataValues.Amount : null;
      const unitPriceInLBP = unitPrice ? unitPrice * 89500 : null;
  
      return {
        ...drug.dataValues,
        dosage,
        route,
        form,
        presentation,
        ManufacturerName,
        CountryName,
        priceInLBP,
        unitPrice,
        unitPriceInLBP
      };
    });
    
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
      attributes: [
        'DrugName', 'DrugNameAR', 'ManufacturerID', 'ProductType', 'Price', 'ATCRelatedIngredient', 'ImagesPath', 
        'SubsidyPercentage', 'NotMarketed',  'DrugID', 'isOTC', 'RegistrationNumber', 'Substitutable', 'Amount',
        'Dosage', 'Form','Route', 'Presentation', 'Agent', 'Manufacturer', 'Country','MoPHCode',
      ],
    });
  
    const drugsWithDosageAndRoute = drugs.map(drug => {
      const dosage = drug.Dosage;
      const route = drug.Route; // Assuming 'Form' corresponds to 'route'
      const form = drug.Form;
      const presentation = drug.Presentation;
      const ManufacturerName = drug.Manufacturer;
      const CountryName = drug.Country;
      const priceInLBP = drug.Price * 89500;
      const unitPrice = drug.dataValues.Amount ? drug.Price / drug.dataValues.Amount : null;
      const unitPriceInLBP = unitPrice ? unitPrice * 89500 : null;
  
      return {
        ...drug.dataValues,
        dosage,
        route,
        form,
        presentation,
        ManufacturerName,
        CountryName,
        priceInLBP,
        unitPrice,
        unitPriceInLBP
      };
    });
    return drugsWithDosageAndRoute;
    } catch (error) {
    console.error("Error in searchDrugByATCName:", error);
    throw new Error('Error occurred in searchDrugByATCName: ' + error.message);
  }
};
const getDrugById = async (DrugIDs) => {
  try {
    const drugIdArray = DrugIDs.split(',').map(id => id.trim()); // Split and trim the DrugIDs

    const drugs = await Drug.findAll({
      where: {
        DrugID: drugIdArray,
      },
      attributes: [
        "DrugID", "DrugName", "DrugNameAr", "isOTC", "ATCRelatedIngredient", "ProductType", "SubsidyPercentage", "MoPHCode", "Price", "ImagesPath",
        "ManufacturerID", "RegistrationNumber", "NotMarketed", "Amount", "Dosage", "Form", "Presentation", "Agent", "Manufacturer", "Country", "Route", "Stratum"
      ],
    });

    if (!drugs.length) {
      throw new Error('No drugs found');
    }

    const drugsWithATC = await Promise.all(drugs.map(async (drug) => {
      const drugPlainData = drug.get({ plain: true });

      // Fetch ATC code for each drug
      let ATC;
      try {
        ATC = await ATCService.getATCByDrugID(drugPlainData.DrugID);
      } catch (error) {
        ATC = null;
      }

      const priceInLBP = drugPlainData.Price * 89500;
      const amount = drugPlainData.Amount;
      const unitPrice = amount > 0 ? drugPlainData.Price / amount : null;
      const unitPriceInLBP = unitPrice ? unitPrice * 89500 : null;

      return {
        ...drugPlainData,
        ATC,
        priceInLBP,
        unitPrice,
        unitPriceInLBP,
        AgentName: drugPlainData.Manufacturer // Assuming AgentName is the same as ManufacturerName
      };
    }));

    return drugsWithATC;
  } catch (error) {
    throw new Error("Error in getDrugById: " + error.message);
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
    // Fetch all drugs with associated presentations and dosages
    const drugs = await Drug.findAll({
      include: [
        {
          model: DrugPresentation,
          attributes: [
            'UnitQuantity1',
            'UnitType1',
            'UnitQuantity2',
            'UnitType2',
            'PackageQuantity1',
            'PackageType1',
            'PackageQuantity2',
            'PackageType2',
            'PackageQuantity3',
            'PackageType3',
            'Description',
          ],
        },
        {
          model: Dosage,
          attributes: [
            'Numerator1',
            'Numerator1Unit',
            'Denominator1',
            'Denominator1Unit',
            'Numerator2',
            'Numerator2Unit',
            'Denominator2',
            'Denominator2Unit',
            'Numerator3',
            'Numerator3Unit',
            'Denominator3',
            'Denominator3Unit',
          ],
        },
      ],
    });

    return { drugs };
  } catch (error) {
    console.error('Error fetching all drugs with details:', error);
    throw new Error('Failed to fetch all drugs with details');
  }
};


const getAllDrugsPaginated = async (page = 1, limit = 500) => {
    try {
      const offset = (page - 1) * limit;

      // Fetch drugs with associated presentations and dosages
      const { rows, count } = await Drug.findAndCountAll({
        offset,
        limit,
        include: [
          {
            model: DrugPresentation,
            attributes: [
              'UnitQuantity1',
              'UnitType1',
              'UnitQuantity2',
              'UnitType2',
              'PackageQuantity1',
              'PackageType1',
              'PackageQuantity2',
              'PackageType2',
              'PackageQuantity3',
              'PackageType3',
              'Description',
            ],
          },
          {
            model: Dosage,
            attributes: [
              'Numerator1',
              'Numerator1Unit',
              'Denominator1',
              'Denominator1Unit',
              'Numerator2',
              'Numerator2Unit',
              'Denominator2',
              'Denominator2Unit',
              'Numerator3',
              'Numerator3Unit',
              'Denominator3',
              'Denominator3Unit',
            ],
          },
        ],
      });

      return { drugs: rows, totalPages: Math.ceil(count / limit) };
    } catch (error) {
      console.error('Error fetching paginated drugs with details:', error);
      throw new Error('Failed to fetch paginated drugs with details');
    }
  };

const getAllDrugsPaginatedByATC = async (page = 1, limit = 500) => {
  try {
    const offset = (page - 1) * limit;
    const { rows, count } = await Drug.findAndCountAll({
      offset,
      limit,
      order: [['ATC', 'ASC']],
    });
    return { drugs: rows, totalPages: Math.ceil(count / limit) };
  } catch (error) {
    console.error("Error fetching paginated drugs by ATC:", error);
    throw new Error("Failed to fetch paginated drugs by ATC");
  }
};
const smartSearch = async (query) => {
  try {
    console.log("Query:", query); // Log the query

    // Include GTIN in the attributes
    const drugs = await Drug.findAll({
      attributes: [
        'DrugName', 'DrugNameAR', 'ManufacturerID', 'ProductType', 'Price', 'ATCRelatedIngredient', 'ImagesPath', 
        'SubsidyPercentage', 'NotMarketed', 'DrugID', 'isOTC', 'RegistrationNumber', 'Substitutable', 'Amount',
        'Dosage', 'Form', 'Presentation', 'Agent', 'Manufacturer', 'Country', 'Route', 'MoPHCode', 'GTIN'
      ],
    });
    
    const options = {
      keys: ['DrugName', 'ATCRelatedIngredient', 'GTIN'], // Include GTIN in searchable keys
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
      const dosage = drug.Dosage;
      const route = drug.Route;
      const form = drug.Form;
      const presentation = drug.Presentation;
      const ManufacturerName = drug.Manufacturer;
      const CountryName = drug.Country;
      const priceInLBP = drug.Price * 89500;

      const amount = drug.dataValues.Amount;
      const price = drug.Price;

      let unitPrice = null;
      let unitPriceInLBP = null;

      if (amount && amount > 0) {
        unitPrice = price / amount;
        unitPriceInLBP = unitPrice * 89500;
      }

      // Fetch the additional data from getDrugById
      let ATC;
      let stratum;
      try {
        ATC = await ATCService.getATCByDrugID(drug.DrugID);
        stratum = drug.Stratum;
      } catch (error) {
        ATC = null;
        stratum = null;
      }

      return { 
        ...drug.get({ plain: true }),
        dosage, 
        route, 
        form, 
        presentation, 
        priceInLBP, 
        unitPriceInLBP, 
        unitPrice, 
        ManufacturerName, 
        CountryName,
        ATC, // Include ATC
        stratum // Include stratum
      };
    }));

    if (drugId) {
      try {
        const substitutes = await Substitute.findAll({
          where: { Drug: drugId },
          attributes: ['Substitute'],
        });

        if (substitutes.length > 0) {
          console.log("Substitutes found:", substitutes); // Log the substitutes found

          const substituteDrugs = await Drug.findAll({
            where: {
              DrugID: substitutes.map(sub => sub.Substitute)
            },
            attributes: [
              'DrugName', 'DrugNameAR', 'ManufacturerID', 'ProductType', 'Price', 'ATCRelatedIngredient', 'ImagesPath', 
              'SubsidyPercentage', 'NotMarketed',  'DrugID', 'isOTC', 'RegistrationNumber', 'Substitutable', 'Amount',
              'Dosage', 'Form', 'Presentation', 'Agent', 'Manufacturer', 'Country', 'Route', 'MoPHCode', 'GTIN'
            ],
          });

          const substitutesWithDosageAndRoute = await Promise.all(substituteDrugs.map(async (substituteDrug) => {
            const dosage = substituteDrug.Dosage;
            const route = substituteDrug.Route;
            const form = substituteDrug.Form;
            const presentation = substituteDrug.Presentation;
            const ManufacturerName = substituteDrug.Manufacturer;
            const CountryName = substituteDrug.Country;
            const priceInLBP = substituteDrug.Price * 89500;

            const amount = substituteDrug.dataValues.Amount;
            const price = substituteDrug.Price;

            let unitPrice = null;
            let unitPriceInLBP = null;

            if (amount && amount > 0) {
              unitPrice = price / amount;
              unitPriceInLBP = unitPrice * 89500;
            }

            // Fetch the additional data from getDrugById for substitutes
            let ATC;
            let stratum;
            try {
              ATC = await ATCService.getATCByDrugID(substituteDrug.DrugID);
              stratum = substituteDrug.Stratum;
            } catch (error) {
              ATC = null;
              stratum = null;
            }

            return { 
              ...substituteDrug.get({ plain: true }),
              dosage, 
              route, 
              form, 
              presentation, 
              priceInLBP, 
              unitPriceInLBP, 
              unitPrice, 
              ManufacturerName, 
              CountryName,
              ATC, // Include ATC for substitutes
              stratum // Include stratum for substitutes
            };
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
        attributes: ['DrugName', 'DrugNameAR', 'ManufacturerID', 'ProductType', 'Price', 'ATCRelatedIngredient', 'ImagesPath', 'SubsidyPercentage','NotMarketed','DrugID','isOTC','RegistrationNumber','Substitutable','MoPHCode'],
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
    // Find the latest dosage by DrugID
    const dosage = await Dosage.findOne({
      where: { DrugId: DrugID },
      attributes: ['DosageId', 'Numerator1', 'Numerator1Unit', 'Denominator1', 'Denominator1Unit', 'Numerator2', 'Numerator2Unit', 'Denominator2', 'Denominator2Unit', 'Numerator3', 'Numerator3Unit', 'Denominator3', 'Denominator3Unit'],
      order: [['CreatedDate', 'DESC']] // Order by CreatedDate to get the newest
    });

    if (!dosage) {
      throw new Error(`No dosage found for drug ID: ${DrugID}`);
    }

    return dosage;
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
    // Find the latest drug presentation by DrugID
    const drugPresentation = await DrugPresentation.findOne({
      where: { DrugId: DrugID },
      attributes: ['PresentationId', 'UnitQuantity1', 'UnitType1', 'UnitQuantity2', 'UnitType2', 'PackageQuantity1', 'PackageType1', 'PackageQuantity2', 'PackageType2', 'PackageQuantity3', 'PackageType3', 'Description'],
      order: [['CreatedDate', 'DESC']] // Order by CreatedDate to get the newest
    });

    if (!drugPresentation) {
      throw new Error(`No presentation found for drug ID: ${DrugID}`);
    }

    return drugPresentation;
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

// drugService.js
const checkMate = async ({ GTIN, BatchNumber, SerialNumber, ExpiryDate }) => {
  try {
    console.log('Input Parameters:', { GTIN, BatchNumber, SerialNumber, ExpiryDate });

    if (typeof GTIN !== 'string') {
      throw new Error('GTIN must be a string');
    }

    if (SerialNumber.length > 20) {
      throw new Error('SerialNumber cannot exceed 20 characters.');
    }

    // Query for the batch lot using GTIN and BatchNumber
    const batchLot = await BatchLotTracking.findOne({
      where: {
        GTIN: GTIN,
        BatchNumber: BatchNumber,
      }
    });

    console.log('Batch lot found:', batchLot); // Log the batch lot details

    if (!batchLot) {
      console.log('No batch lot found for GTIN:', GTIN, 'BatchNumber:', BatchNumber);
      return {
        isValid: false,
        messageEN: 'This drug is not imported legally by the importation process of the MoPH. You are advised to check if it is forged!',
        messageAR: 'هذا الدّواء غير مستورد قانونياً وفق آليات استيراد الدواء المعتمدة من قبل وزارة الصحة العامة. يرجى الإنتباه قد يكون هذا الدّواء مزوّر.'
      };
    }

    // Ensure the SerialNumber is correctly formatted
    const formattedSerialNumber = SerialNumber.trim();

    // Query for the batch serial number using BatchId and SerialNumber
    const batchSerialNumber = await BatchSerialNumber.findOne({
      where: {
        BatchId: batchLot.BatchLotId,
        SerialNumber: formattedSerialNumber,
      }
    });

    console.log('Batch serial number lookup with BatchId:', batchLot.BatchLotId, 'and SerialNumber:', formattedSerialNumber);

    if (!batchSerialNumber) {
      console.log('No batch serial number found for BatchId:', batchLot.BatchLotId, 'SerialNumber:', formattedSerialNumber);
      return {
        isValid: false,
        messageEN: 'This drug is not imported legally by the importation process of the MoPH. You are advised to check if it is forged!',
        messageAR: 'هذا الدّواء غير مستورد قانونياً وفق آليات استيراد الدواء المعتمدة من قبل وزارة الصحة العامة. يرجى الإنتباه قد يكون هذا الدّواء مزوّر.'
      };
    }

    console.log('Batch serial number found:', batchSerialNumber); // Log the batch serial number details

    // Return a successful response including the batch lot details
    return {
      isValid: true,
      messageEN: 'This drug is imported legally by the importation process of the MoPH.',
      messageAR: 'هذا الدّواء مستورد قانونياً وفق آليات استيراد الدّواء المعتمدة من قبل وزارة الصحة العامة.',
      batchLot: {
        BatchLotId:batchLot.BatchLotId,
        DrugName: batchLot.DrugName,
        Form: batchLot.Form,
        Presentation: batchLot.Presentation,
        Quantity: batchLot.Quantity,
        Laboratory: batchLot.Laboratory,
        LaboratoryCountry: batchLot.LaboratoryCountry,
        BoxId: batchLot.BoxId
      }
    };
  } catch (error) {
    console.error('Error in checkMate:', error); // Log any errors that occur
    throw error;
  }
};





const getOTCDrugs = async () => {
  try {
    const drugs = await Drug.findAll({
      where: {
        isOTC: true
      },
      attributes: [
        'DrugName', 'DrugNameAR', 'ManufacturerID', 'ProductType', 'Price', 'ATCRelatedIngredient', 'ImagesPath', 
        'SubsidyPercentage', 'NotMarketed',  'DrugID', 'isOTC', 'RegistrationNumber', 'Substitutable', 'Amount',
        'Dosage', 'Form','Route', 'Presentation', 'Agent', 'Manufacturer', 'Country','MoPHCode'
      ],
    });

    const drugsWithDosageAndRoute = drugs.map(drug => {
      const dosage = drug.Dosage;
      const route = drug.Route; // Assuming 'Form' corresponds to 'route'
      const form = drug.Form;
      const presentation = drug.Presentation;
      const ManufacturerName = drug.Manufacturer;
      const CountryName = drug.Country;
      const priceInLBP = drug.Price * 89500;
      const unitPrice = drug.dataValues.Amount ? drug.Price / drug.dataValues.Amount : null;
      const unitPriceInLBP = unitPrice ? unitPrice * 89500 : null;
  
      return {
        ...drug.dataValues,
        dosage,
        route,
        form,
        presentation,
        ManufacturerName,
        CountryName,
        priceInLBP,
        unitPrice,
        unitPriceInLBP
      };
    });

    return drugsWithDosageAndRoute;
  } catch (error) {
    console.error("Error in getOTCDrugs:", error);
    throw new Error('Error occurred in getOTCDrugs: ' + error.message);
  }
};
const getDrugSubstitutes = async (drugName) => {
  try {
    const drug = await Drug.findOne({
      where: { DrugName: drugName },
      attributes: [
        'DrugName', 'DrugNameAR', 'ManufacturerID', 'ProductType', 'Price', 'ATCRelatedIngredient', 'ImagesPath', 
        'SubsidyPercentage', 'NotMarketed',  'DrugID', 'isOTC', 'RegistrationNumber', 'Substitutable', 'Amount',
        'Dosage', 'Form', 'Presentation', 'Agent', 'Manufacturer', 'Country', 'Route','MoPHCode'
      ],
    });

    if (!drug) {
      throw new Error(`Drug with name ${drugName} not found`);
    }

    const substitutes = await Substitute.findAll({
      where: { Drug: drug.DrugID },
      attributes: ['Substitute'],
    });

    const substituteDrugs = await Drug.findAll({
      where: {
        DrugID: substitutes.map(sub => sub.Substitute)
      },
      attributes: [
        'DrugName', 'DrugNameAR', 'ManufacturerID', 'ProductType', 'Price', 'ATCRelatedIngredient', 'ImagesPath', 
        'SubsidyPercentage', 'NotMarketed',  'DrugID', 'isOTC', 'RegistrationNumber', 'Substitutable', 'Amount',
        'Dosage', 'Form', 'Presentation', 'Agent', 'Manufacturer', 'Country', 'Route','MoPHCode'
      ],
    });

    const substitutesWithDetails = substituteDrugs.map(substituteDrug => {
      const dosage = substituteDrug.Dosage;
      const route = substituteDrug.Route; // Correctly map route
      const form = substituteDrug.Form; // Correctly map form
      const presentation = substituteDrug.Presentation;
      const ManufacturerName = substituteDrug.Manufacturer;
      const CountryName = substituteDrug.Country;
      const priceInLBP = substituteDrug.Price * 89500;

      const amount = substituteDrug.dataValues.Amount; // Directly use the integer value of Amount
      const price = substituteDrug.Price;

      let unitPrice = null;
      let unitPriceInLBP = null;

      if (amount && amount > 0) {
        unitPrice = price / amount;
        unitPriceInLBP = unitPrice * 89500;
      }

      return {
        ...substituteDrug.get({ plain: true }),
        dosage,
        route,
        form,
        presentation,
        priceInLBP,
        unitPriceInLBP,
        unitPrice,
        ManufacturerName,
        CountryName,
      };
    });

    // Sort the substitutes by price from lowest to highest
    substitutesWithDetails.sort((a, b) => a.Price - b.Price);

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

const deleteDrug = async (DrugID) => {
  try {
    // Delete dosages by DrugID
    await deleteDosagesByDrugId(DrugID);

    // Delete presentations by DrugID
    await deletePresentationsByDrugId(DrugID);

    // Delete the drug itself
    const drug = await Drug.findOne({
      where: { DrugID: DrugID }
    });

    if (!drug) {
      throw new Error(`No drug found with ID: ${DrugID}`);
    }

    await drug.destroy();
    return drug;
  } catch (error) {
    console.error("Error in deleteDrug:", error);
    throw new Error('Error occurred in deleteDrug: ' + error.message);
  }
};


const updateDrug = async (DrugID, updatedData) => {
  try {
    const drug = await Drug.findOne({
      where: { DrugID: DrugID },
    });

    if (!drug) {
      throw new Error(`No drug found with ID: ${DrugID}`);
    }

    await drug.update(updatedData);
    return drug;
  } catch (error) {
    console.error("Error in updateDrug:", error);
    throw new Error('Error occurred in updateDrug: ' + error.message);
  }
};
const deleteDosagesByDrugId = async (DrugID, transaction) => {
  try {
    await Dosage.destroy({
      where: { DrugId: DrugID },
      transaction,
    });
  } catch (error) {
    console.error("Error in deleteDosagesByDrugId:", error);
    throw new Error('Error occurred in deleteDosagesByDrugId: ' + error.message);
  }
};
const deletePresentationsByDrugId = async (DrugID, transaction) => {
  try {
    await DrugPresentation.destroy({
      where: { DrugId: DrugID },
      transaction,
    });
  } catch (error) {
    console.error("Error in deletePresentationsByDrugId:", error);
    throw new Error('Error occurred in deletePresentationsByDrugId: ' + error.message);
  }
};
const fetchDrugDataFromServer = async () => {
  try {
    // Fetch drug data from the server
    const drugs = await Drug.findAll({
      attributes: [
        'DrugID', 'DrugName', 'DrugNameAR', 'ATC_Code', 'Stratum', 'ManufacturerID', 'ProductType', 'Price', 'ATCRelatedIngredient', 
        'ImagesPath', 'SubsidyPercentage', 'NotMarketed', 'isOTC', 'RegistrationNumber', 
        'Substitutable', 'Amount', 'Dosage', 'Form', 'Route', 'Presentation', 'Agent', 'Manufacturer', 
        'Country', 'MoPHCode', 'UpdatedDate', 'GTIN'
      ],
    });

    // Manually map database columns to camelCase fields
    return drugs.map(drug => {
      const unitPrice = drug.dataValues.Amount ? drug.Price / drug.dataValues.Amount : null;

      return {
        drugId: drug.DrugID,
        drugName: drug.DrugName,
        drugNameAr: drug.DrugNameAR,
        code: drug.ATC_Code,
        stratum: drug.Stratum,
        manufacturerId: drug.ManufacturerID,
        productType: drug.ProductType,
        price: drug.Price,
        atcRelatedIngredient: drug.ATCRelatedIngredient,
        imagesPath: drug.ImagesPath,
        subsidyPercentage: drug.SubsidyPercentage,
        notMarketed: drug.NotMarketed,
        isOtc: drug.isOTC,
        registrationNumber: drug.RegistrationNumber,
        substitutable: drug.Substitutable,
        amount: drug.Amount,
        dosage: drug.Dosage,
        form: drug.Form,
        route: drug.Route,
        presentation: drug.Presentation,
        agent: drug.Agent,
        manufacturer: drug.Manufacturer,
        country: drug.Country,
        moPhCode: drug.MoPHCode,
        updatedDate: drug.UpdatedDate,
        priceInLBP: drug.Price * 89500,
        unitPrice: unitPrice,
        unitPriceInLBP: unitPrice ? unitPrice * 89500 : null,
        GTIN: drug.GTIN,
      };
    });
  } catch (error) {
    console.error('Error fetching drug data from server:', error);
    throw new Error('Error fetching drug data from server');
  }
};


const fetchAndUpdateDrugs = async (updateDrugIds) => {
  try {
    if (updateDrugIds.length === 0) {
      console.log('No updates required.');
      return;
    }

    // Fetch the updated data for the drugs needing updates
    const updatedDrugs = await Drug.findAll({
      where: {
        DrugID: {
          [Op.in]: updateDrugIds
        }
      },
      attributes: [
        'DrugID', 'DrugName', 'DrugNameAR', 'ManufacturerID', 'ProductType', 'Price', 'ATCRelatedIngredient', 
        'ImagesPath', 'SubsidyPercentage', 'NotMarketed', 'isOTC', 'RegistrationNumber', 
        'Substitutable', 'Amount', 'Dosage', 'Form', 'Route', 'Presentation', 'Agent', 'Manufacturer', 
        'Country', 'MoPHCode', 'UpdatedDate'
      ]
    });

    // Replace the local copy with the updated data in the database
    for (const updatedDrug of updatedDrugs) {
      await Drug.update(
        {
          DrugName: updatedDrug.DrugName,
          DrugNameAR: updatedDrug.DrugNameAR,
          ManufacturerID: updatedDrug.ManufacturerID,
          ProductType: updatedDrug.ProductType,
          Price: updatedDrug.Price,
          ATCRelatedIngredient: updatedDrug.ATCRelatedIngredient,
          ImagesPath: updatedDrug.ImagesPath,
          SubsidyPercentage: updatedDrug.SubsidyPercentage,
          NotMarketed: updatedDrug.NotMarketed,
          isOTC: updatedDrug.isOTC,
          RegistrationNumber: updatedDrug.RegistrationNumber,
          Substitutable: updatedDrug.Substitutable,
          Amount: updatedDrug.Amount,
          Dosage: updatedDrug.Dosage,
          Form: updatedDrug.Form,
          Route: updatedDrug.Route,
          Presentation: updatedDrug.Presentation,
          Agent: updatedDrug.Agent,
          Manufacturer: updatedDrug.Manufacturer,
          Country: updatedDrug.Country,
          MoPHCode: updatedDrug.MoPHCode,
          UpdatedDate: updatedDrug.UpdatedDate
        },
        { where: { DrugID: updatedDrug.DrugID } }
      );
    }

    console.log('Drugs updated successfully.');
  } catch (error) {
    console.error('Error fetching or updating drugs:', error);
    throw new Error('Error fetching or updating drugs');
  }
};

const checkForDrugUpdates = async () => {
  try {
    // Fetch all drugs in the local database
    const localDrugs = await Drug.findAll({
      attributes: ['DrugID', 'UpdatedDate']
    });

    const drugsNeedingUpdate = [];

    for (const localDrug of localDrugs) {
      // Fetch the server data to compare with local data
      const serverDrug = await Drug.findOne({
        where: { DrugID: localDrug.DrugID },
        attributes: ['DrugID', 'UpdatedDate']
      });

      // Compare timestamps, if server version is newer, mark for update
      if (serverDrug && new Date(serverDrug.UpdatedDate) > new Date(localDrug.UpdatedDate)) {
        drugsNeedingUpdate.push(localDrug.DrugID);
      }
    }

    return drugsNeedingUpdate;
  } catch (error) {
    console.error('Error checking for drug updates:', error);
    throw new Error('Error checking for drug updates');
  }
};
const updateDrugImage = async (DrugID, imagePath) => {
  try {
    console.log(`Updating DrugID ${DrugID} with imagePath ${imagePath}`);
    const drug = await Drug.findOne({ where: { DrugID } });

    if (!drug) {
      console.error(`No drug found with ID: ${DrugID}`);
      throw new Error(`No drug found with ID: ${DrugID}`);
    }

    drug.ImagesPath = imagePath;
    await drug.save();
    console.log('Image path updated in DB:', drug.ImagesPath);

    return drug;
  } catch (error) {
    console.error('Error in updateDrugImage:', error);
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
  checkDrugNameInAPI,
  deleteDrug,
  updateDrug,
  deleteDosagesByDrugId,
  deletePresentationsByDrugId,
  getAllDrugsPaginated,
  getAllDrugsPaginatedByATC,
  fetchAndUpdateDrugs,
  fetchDrugDataFromServer,
  checkForDrugUpdates,
  updateDrugImage,
  
};
