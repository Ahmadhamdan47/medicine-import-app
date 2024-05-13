"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// src/services/drugService.js
var Sequelize = require("sequelize");

var _require = require("sequelize"),
    Op = _require.Op;

var Drug = require("../models/pharmacyDrug");

var PharmacyDrug = require("../models/pharmacyDrug");

var drug_atc_mapping = require("../models/atcMapping");

var ATC_Code = require("../models/ATC"); // Assuming you have a model for ATC_Code


var ATCService = require("./atcService");

var _require2 = require("uuid"),
    uuidv4 = _require2.v4;

var Substitute = require('../models/substitute');

var DrugATCMapping = require('../models/atcMapping');

var substituteService = require('./substituteService');

var Dosage = require('../models/dosage');

var DosageForm = require('../models/dosageForm');

var DosageFormMapping = require('../models/dosageFormMapping');

var DrugRoute = require('../models/drugRoute');

var Agent = require('../models/agent');

var Route = require('../models/route');

var PresentationType = require('../models/presentationType');

var DrugPresentation = require('../models/drugPresentation');

var StratumType = require('../models/stratumType');

var DrugStratum = require('../models/drugStratum');

var Fuse = require('fuse.js');

var BatchLotTracking = require('../models/BatchLot');

var BatchSerialNumber = require('../models/batchserialnumber');

var DiseaseCategory = require('../models/diseaseCategory');

var DiseaseCategoryATC = require('../models/diseaseCategoryAtc');

var getDrugByDiseaseCategory = function getDrugByDiseaseCategory(categoryName) {
  var diseaseCategory, diseaseCategoryId, diseaseCategoryAtc, atcId, drugIds, drugs;
  return regeneratorRuntime.async(function getDrugByDiseaseCategory$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(DiseaseCategory.findOne({
            where: {
              CategoryName: categoryName
            }
          }));

        case 2:
          diseaseCategory = _context2.sent;
          diseaseCategoryId = diseaseCategory.DiseaseCategoryId;
          console.log(diseaseCategoryId);
          _context2.next = 7;
          return regeneratorRuntime.awrap(DiseaseCategoryATC.findOne({
            where: {
              DiseaseCategoryId: diseaseCategoryId
            }
          }));

        case 7:
          diseaseCategoryAtc = _context2.sent;
          atcId = diseaseCategoryAtc.ATC_CodeId;
          console.log(atcId);
          _context2.next = 12;
          return regeneratorRuntime.awrap(drug_atc_mapping.findAll({
            where: {
              ATC_ID: _defineProperty({}, Op.eq, atcId)
            }
          }));

        case 12:
          drugIds = _context2.sent;
          _context2.next = 15;
          return regeneratorRuntime.awrap(Promise.all(drugIds.map(function _callee(drugId) {
            var drug;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(Drug.findOne({
                      where: {
                        DrugID: drugId.DrugID
                      },
                      attributes: ['DrugName', 'DrugNameAR', 'ManufacturerID', 'ProductType', 'Price', 'ATCRelatedIngredient', 'ImagesPath', 'SubsidyPercentage', 'NotMarketed']
                    }));

                  case 2:
                    drug = _context.sent;
                    return _context.abrupt("return", drug);

                  case 4:
                  case "end":
                    return _context.stop();
                }
              }
            });
          })));

        case 15:
          drugs = _context2.sent;
          return _context2.abrupt("return", drugs);

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var searchDrugByATCName = function searchDrugByATCName(atcName) {
  var drugs, drugsWithDosageAndRoute;
  return regeneratorRuntime.async(function searchDrugByATCName$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Drug.findAll({
            where: {
              ATCRelatedIngredient: _defineProperty({}, Op.like, "%".concat(atcName, "%"))
            },
            attributes: ['DrugName', 'DrugNameAR', 'ManufacturerID', 'ProductType', 'Price', 'ATCRelatedIngredient', 'ImagesPath', 'SubsidyPercentage', 'NotMarketed']
          }));

        case 3:
          drugs = _context4.sent;
          _context4.next = 6;
          return regeneratorRuntime.awrap(Promise.all(drugs.map(function _callee2(drug) {
            var dosage, route, presentation, Manufacturer, ManufacturerName, CountryName, priceInLBP, unitPrice, unitPriceInLBP;
            return regeneratorRuntime.async(function _callee2$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return regeneratorRuntime.awrap(getDosageByDrugName(drug.DrugName));

                  case 2:
                    dosage = _context3.sent;
                    _context3.next = 5;
                    return regeneratorRuntime.awrap(getRouteByDrugName(drug.DrugName));

                  case 5:
                    route = _context3.sent;
                    _context3.next = 8;
                    return regeneratorRuntime.awrap(getPresentationByDrugName(drug.DrugName));

                  case 8:
                    presentation = _context3.sent;
                    _context3.next = 11;
                    return regeneratorRuntime.awrap(Agent.findOne({
                      where: {
                        AgentID: drug.ManufacturerID
                      }
                    }));

                  case 11:
                    Manufacturer = _context3.sent;
                    ManufacturerName = Manufacturer.AgentName;
                    CountryName = Manufacturer.Country;
                    priceInLBP = drug.Price * 90000;
                    unitPrice = drug.Price / presentation.Amount;
                    unitPriceInLBP = unitPrice * 90000;
                    return _context3.abrupt("return", _objectSpread({}, drug.dataValues, {
                      dosage: dosage,
                      route: route,
                      presentation: presentation,
                      ManufacturerName: ManufacturerName,
                      CountryName: CountryName,
                      priceInLBP: priceInLBP,
                      unitPrice: unitPrice,
                      unitPriceInLBP: unitPriceInLBP
                    }));

                  case 18:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          })));

        case 6:
          drugsWithDosageAndRoute = _context4.sent;
          return _context4.abrupt("return", drugsWithDosageAndRoute);

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](0);
          console.error("Error in searchDrugByATCName:", _context4.t0);
          throw new Error('Error occurred in searchDrugByATCName: ' + _context4.t0.message);

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var searchDrugByName = function searchDrugByName(query) {
  var drugs, drugsWithDosageAndRoute;
  return regeneratorRuntime.async(function searchDrugByName$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Drug.findAll({
            where: {
              DrugName: _defineProperty({}, Op.like, "%".concat(query, "%"))
            },
            attributes: ['DrugName', 'DrugNameAR', 'ManufacturerID', 'ProductType', 'Price', 'ATCRelatedIngredient', 'ImagesPath', 'SubsidyPercentage', 'NotMarketed']
          }));

        case 3:
          drugs = _context6.sent;
          _context6.next = 6;
          return regeneratorRuntime.awrap(Promise.all(drugs.map(function _callee3(drug) {
            var dosage, route, presentation, Manufacturer, ManufacturerName, CountryName, priceInLBP, unitPrice, unitPriceInLBP;
            return regeneratorRuntime.async(function _callee3$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.next = 2;
                    return regeneratorRuntime.awrap(getDosageByDrugName(drug.DrugName));

                  case 2:
                    dosage = _context5.sent;
                    _context5.next = 5;
                    return regeneratorRuntime.awrap(getRouteByDrugName(drug.DrugName));

                  case 5:
                    route = _context5.sent;
                    _context5.next = 8;
                    return regeneratorRuntime.awrap(getPresentationByDrugName(drug.DrugName));

                  case 8:
                    presentation = _context5.sent;
                    _context5.next = 11;
                    return regeneratorRuntime.awrap(Agent.findOne({
                      where: {
                        AgentID: drug.ManufacturerID
                      }
                    }));

                  case 11:
                    Manufacturer = _context5.sent;
                    ManufacturerName = Manufacturer.AgentName;
                    CountryName = Manufacturer.Country;
                    priceInLBP = drug.Price * 90000;
                    unitPrice = drug.Price / presentation.Amount;
                    unitPriceInLBP = unitPrice * 90000;
                    return _context5.abrupt("return", _objectSpread({}, drug.dataValues, {
                      dosage: dosage,
                      route: route,
                      presentation: presentation,
                      ManufacturerName: ManufacturerName,
                      CountryName: CountryName,
                      priceInLBP: priceInLBP,
                      unitPrice: unitPrice,
                      unitPriceInLBP: unitPriceInLBP
                    }));

                  case 18:
                  case "end":
                    return _context5.stop();
                }
              }
            });
          })));

        case 6:
          drugsWithDosageAndRoute = _context6.sent;
          return _context6.abrupt("return", drugsWithDosageAndRoute);

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](0);
          console.error("Error in searchDrugByATCName:", _context6.t0);
          throw new Error('Error occurred in searchDrugByATCName: ' + _context6.t0.message);

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var getDrugById = function getDrugById(DrugID) {
  var _drug, dosage, route, presentation, ATC, priceInLBP, unitPrice, unitPriceInLBP, Manufacturer, ManufacturerName, AgentName, CountryName, stratum, imagesPath, allDrugData;

  return regeneratorRuntime.async(function getDrugById$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(Drug.findOne({
            where: {
              DrugID: DrugID
            },
            attributes: ["DrugName", "DrugNameAr", "isOTC", "ATCRelatedIngredient", "ProductType", "SubsidyPercentage", "MoPHCode", "Price", "imagesPath", 'ManufacturerID', 'RegistrationNumber', 'NotMarketed', 'ImagesPath']
          }));

        case 3:
          _drug = _context7.sent;
          _context7.next = 6;
          return regeneratorRuntime.awrap(getDosageByDrugId(DrugID));

        case 6:
          dosage = _context7.sent;
          _context7.next = 9;
          return regeneratorRuntime.awrap(getRouteByDrugId(DrugID));

        case 9:
          route = _context7.sent;
          _context7.next = 12;
          return regeneratorRuntime.awrap(getPresentationByDrugId(DrugID));

        case 12:
          presentation = _context7.sent;
          _context7.next = 15;
          return regeneratorRuntime.awrap(ATCService.getATCByDrugID(DrugID));

        case 15:
          ATC = _context7.sent;
          priceInLBP = _drug.Price * 90000;
          unitPrice = _drug.Price / presentation.Amount;
          unitPriceInLBP = unitPrice * 90000;
          _context7.next = 21;
          return regeneratorRuntime.awrap(Agent.findOne({
            where: {
              AgentID: _drug.ManufacturerID
            }
          }));

        case 21:
          Manufacturer = _context7.sent;
          ManufacturerName = Manufacturer.AgentName;
          AgentName = Manufacturer.AgentName;
          CountryName = Manufacturer.Country;
          _context7.next = 27;
          return regeneratorRuntime.awrap(getStratumByDrugId(DrugID));

        case 27:
          stratum = _context7.sent;
          imagesPath = _drug.imagesPath;
          allDrugData = _objectSpread({}, _drug.get({
            plain: true
          }), {
            dosage: dosage,
            route: route,
            presentation: presentation,
            priceInLBP: priceInLBP,
            unitPriceInLBP: unitPriceInLBP,
            unitPrice: unitPrice,
            imagesPath: imagesPath,
            stratum: stratum,
            ATC: ATC,
            ManufacturerName: ManufacturerName,
            CountryName: CountryName,
            AgentName: AgentName
          });
          return _context7.abrupt("return", allDrugData);

        case 33:
          _context7.prev = 33;
          _context7.t0 = _context7["catch"](0);
          throw new Error("Error in drugService: " + _context7.t0.message);

        case 36:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 33]]);
}; // src/services/drugService.js


var filterDrugs = function filterDrugs(drugs) {
  var sortedDrugs;
  return regeneratorRuntime.async(function filterDrugs$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          sortedDrugs = drugs.sort(function (a, b) {
            return a.DrugName.localeCompare(b.DrugName);
          });
          console.log(sortedDrugs);
          return _context8.abrupt("return", sortedDrugs);

        case 6:
          _context8.prev = 6;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          throw new Error("Error in drugService: " + _context8.t0.message);

        case 10:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

var addDrug = function addDrug(drugData) {
  var newDrug;
  return regeneratorRuntime.async(function addDrug$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          // Convert UUID strings to the appropriate format
          drugData.CreatedBy = uuidv4();
          drugData.UpdatedBy = uuidv4();
          drugData.CurrencyForeign = uuidv4();
          _context9.next = 6;
          return regeneratorRuntime.awrap(Drug.create(drugData));

        case 6:
          newDrug = _context9.sent;
          return _context9.abrupt("return", newDrug);

        case 10:
          _context9.prev = 10;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          throw new Error("Error in drugService: " + _context9.t0.message);

        case 14:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var addPharmacyDrug = function addPharmacyDrug(drugData) {
  var newDrug;
  return regeneratorRuntime.async(function addPharmacyDrug$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return regeneratorRuntime.awrap(PharmacyDrug.create(drugData));

        case 3:
          newDrug = _context10.sent;
          console.log(newDrug);
          return _context10.abrupt("return", newDrug);

        case 8:
          _context10.prev = 8;
          _context10.t0 = _context10["catch"](0);
          console.error(_context10.t0);

          if (!(_context10.t0 instanceof Sequelize.ValidationError)) {
            _context10.next = 16;
            break;
          }

          // Handle validation errors
          console.error("Validation error in pharmacyDrugService:", _context10.t0);
          throw new Error("Validation error in pharmacyDrugService: " + _context10.t0.message);

        case 16:
          if (!(_context10.t0 instanceof Sequelize.DatabaseError)) {
            _context10.next = 21;
            break;
          }

          // Handle database errors
          console.error("Database error in pharmacyDrugService:", _context10.t0);
          throw new Error("Database error in pharmacyDrugService: " + _context10.t0.message);

        case 21:
          // Handle any other errors
          console.error("Error in pharmacyDrugService:", _context10.t0);
          throw new Error("Error in pharmacyDrugService: " + _context10.t0.message);

        case 23:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var getAllDrugs = function getAllDrugs() {
  var drugs;
  return regeneratorRuntime.async(function getAllDrugs$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return regeneratorRuntime.awrap(Drug.findAll({// attributes: [
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
          }));

        case 3:
          drugs = _context11.sent;
          return _context11.abrupt("return", drugs);

        case 7:
          _context11.prev = 7;
          _context11.t0 = _context11["catch"](0);
          console.error("Error fetching drugs:", _context11.t0);
          throw new Error("Failed to fetch drugs");

        case 11:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var smartSearch = function smartSearch(query) {
  var drugs, options, fuse, results, drugId, _drug2, drugsWithDosageAndRoute, substitutes, substitutesWithDosageAndRoute;

  return regeneratorRuntime.async(function smartSearch$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          console.log("Query:", query); // Log the query

          _context14.next = 4;
          return regeneratorRuntime.awrap(Drug.findAll({
            attributes: ['DrugName', 'DrugNameAR', 'ManufacturerID', 'ProductType', 'Price', 'ATCRelatedIngredient', 'ImagesPath', 'SubsidyPercentage', 'NotMarketed']
          }));

        case 4:
          drugs = _context14.sent;
          options = {
            keys: ['DrugName', 'ATCRelatedIngredient', 'GTIN'],
            includeScore: true,
            threshold: 0.3,
            // Adjust this value to change the sensitivity of the search
            isCaseSensitive: false
          };
          fuse = new Fuse(drugs, options);
          results = fuse.search(query);

          if (results.some(function (result) {
            return result.item.DrugName === query || result.item.GTIN === query;
          })) {
            _drug2 = results.find(function (result) {
              return result.item.DrugName === query || result.item.GTIN === query;
            });
            drugId = _drug2.item.DrugID;
          }

          _context14.next = 11;
          return regeneratorRuntime.awrap(Promise.all(results.map(function _callee4(result) {
            var drug, dosage, route, presentation, Manufacturer, ManufacturerName, CountryName, priceInLBP, unitPrice, unitPriceInLBP;
            return regeneratorRuntime.async(function _callee4$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    drug = result.item;
                    _context12.next = 3;
                    return regeneratorRuntime.awrap(getDosageByDrugName(drug.DrugName));

                  case 3:
                    dosage = _context12.sent;
                    _context12.next = 6;
                    return regeneratorRuntime.awrap(getRouteByDrugName(drug.DrugName));

                  case 6:
                    route = _context12.sent;
                    _context12.next = 9;
                    return regeneratorRuntime.awrap(getPresentationByDrugName(drug.DrugName));

                  case 9:
                    presentation = _context12.sent;
                    _context12.next = 12;
                    return regeneratorRuntime.awrap(Agent.findOne({
                      where: {
                        AgentID: drug.ManufacturerID
                      }
                    }));

                  case 12:
                    Manufacturer = _context12.sent;
                    ManufacturerName = Manufacturer.AgentName;
                    CountryName = Manufacturer.Country;
                    priceInLBP = drug.Price * 90000;
                    unitPrice = drug.Price / presentation.Amount;
                    unitPriceInLBP = unitPrice * 90000;
                    return _context12.abrupt("return", _objectSpread({}, drug.get({
                      plain: true
                    }), {
                      dosage: dosage,
                      route: route,
                      presentation: presentation,
                      priceInLBP: priceInLBP,
                      unitPriceInLBP: unitPriceInLBP,
                      unitPrice: unitPrice,
                      ManufacturerName: ManufacturerName,
                      CountryName: CountryName
                    }));

                  case 19:
                  case "end":
                    return _context12.stop();
                }
              }
            });
          })));

        case 11:
          drugsWithDosageAndRoute = _context14.sent;

          if (!drugId) {
            _context14.next = 28;
            break;
          }

          _context14.prev = 13;
          _context14.next = 16;
          return regeneratorRuntime.awrap(Substitute.findAll({
            where: {
              DrugID: drugId
            },
            include: Drug,
            attributes: ['DrugName', 'DrugNameAR', 'isOTC', 'ManufacturerID', 'RegistrationNumber', 'ProductType', 'Price', 'ATCRelatedIngredient', 'ImagesPath', 'SubsidyPercentage']
          }));

        case 16:
          substitutes = _context14.sent;

          if (!(substitutes.length > 0)) {
            _context14.next = 23;
            break;
          }

          console.log("Substitutes found:", substitutes); // Log the substitutes found

          _context14.next = 21;
          return regeneratorRuntime.awrap(Promise.all(substitutes.map(function _callee5(substitute) {
            var dosage, route, presentation, Manufacturer, ManufacturerName, CountryName, priceInLBP, unitPrice, unitPriceInLBP;
            return regeneratorRuntime.async(function _callee5$(_context13) {
              while (1) {
                switch (_context13.prev = _context13.next) {
                  case 0:
                    _context13.next = 2;
                    return regeneratorRuntime.awrap(getDosageByDrugName(drug.DrugName));

                  case 2:
                    dosage = _context13.sent;
                    _context13.next = 5;
                    return regeneratorRuntime.awrap(getRouteByDrugName(drug.DrugName));

                  case 5:
                    route = _context13.sent;
                    _context13.next = 8;
                    return regeneratorRuntime.awrap(getPresentationByDrugName(drug.DrugName));

                  case 8:
                    presentation = _context13.sent;
                    _context13.next = 11;
                    return regeneratorRuntime.awrap(Agent.findOne({
                      where: {
                        AgentID: drug.ManufacturerID
                      }
                    }));

                  case 11:
                    Manufacturer = _context13.sent;
                    ManufacturerName = Manufacturer.AgentName;
                    CountryName = Manufacturer.Country;
                    priceInLBP = drug.Price * 90000;
                    unitPrice = drug.Price / presentation.Amount;
                    unitPriceInLBP = unitPrice * 90000;
                    return _context13.abrupt("return", _objectSpread({}, drug.get({
                      plain: true
                    }), {
                      dosage: dosage,
                      route: route,
                      presentation: presentation,
                      priceInLBP: priceInLBP,
                      unitPriceInLBP: unitPriceInLBP,
                      unitPrice: unitPrice,
                      ManufacturerName: ManufacturerName,
                      CountryName: CountryName
                    }));

                  case 18:
                  case "end":
                    return _context13.stop();
                }
              }
            });
          })));

        case 21:
          substitutesWithDosageAndRoute = _context14.sent;
          drugsWithDosageAndRoute.push.apply(drugsWithDosageAndRoute, _toConsumableArray(substitutesWithDosageAndRoute));

        case 23:
          _context14.next = 28;
          break;

        case 25:
          _context14.prev = 25;
          _context14.t0 = _context14["catch"](13);
          console.error("No substitutes found for drug:", _context14.t0);

        case 28:
          return _context14.abrupt("return", drugsWithDosageAndRoute);

        case 31:
          _context14.prev = 31;
          _context14.t1 = _context14["catch"](0);
          console.error("Error in smartSearch:", _context14.t1);
          throw new Error('Error occurred in smartSearch: ' + _context14.t1.message);

        case 35:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 31], [13, 25]]);
};

var getDrugByATCLevel = function getDrugByATCLevel(query) {
  var atcCodes, atcIds, drugs;
  return regeneratorRuntime.async(function getDrugByATCLevel$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          _context15.next = 3;
          return regeneratorRuntime.awrap(ATC_Code.findAll({
            where: {
              Code: _defineProperty({}, Op.like, "".concat(query, "%"))
            }
          }));

        case 3:
          atcCodes = _context15.sent;
          console.log(atcCodes); // Extract ATC_IDs from the fetched ATC codes

          atcIds = atcCodes.map(function (atcCode) {
            return atcCode.ATC_ID;
          }); // Fetch all drugs that have the corresponding ATC_IDs

          _context15.next = 8;
          return regeneratorRuntime.awrap(drug_atc_mapping.findAll({
            where: {
              ATC_ID: _defineProperty({}, Op["in"], atcIds)
            },
            include: [{
              model: Drug,
              attributes: ['DrugID', 'DrugName', 'DrugNameAR', 'ManufacturerID', 'ProductType', 'Price', 'ATCRelatedIngredient', 'ImagesPath', 'SubsidyPercentage', 'NotMarketed']
            }]
          }));

        case 8:
          drugs = _context15.sent;
          return _context15.abrupt("return", drugs);

        case 12:
          _context15.prev = 12;
          _context15.t0 = _context15["catch"](0);
          console.error(_context15.t0);
          throw _context15.t0;

        case 16:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var addDrugATC = function addDrugATC(DrugID, ATC_ID) {
  var mapping, sameATCDrugs, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _drug3;

  return regeneratorRuntime.async(function addDrugATC$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.prev = 0;
          _context16.next = 3;
          return regeneratorRuntime.awrap(DrugATCMapping.create({
            DrugID: DrugID,
            ATC_ID: ATC_ID
          }));

        case 3:
          mapping = _context16.sent;
          _context16.next = 6;
          return regeneratorRuntime.awrap(DrugATCMapping.findAll({
            where: {
              ATC_ID: ATC_ID
            }
          }));

        case 6:
          sameATCDrugs = _context16.sent;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context16.prev = 10;
          _iterator = sameATCDrugs[Symbol.iterator]();

        case 12:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context16.next = 22;
            break;
          }

          _drug3 = _step.value;

          if (!(_drug3.DrugID !== DrugID)) {
            _context16.next = 19;
            break;
          }

          _context16.next = 17;
          return regeneratorRuntime.awrap(substituteService.addSubstitute(DrugID, _drug3.DrugID));

        case 17:
          _context16.next = 19;
          return regeneratorRuntime.awrap(substituteService.addSubstitute(_drug3.DrugID, DrugID));

        case 19:
          _iteratorNormalCompletion = true;
          _context16.next = 12;
          break;

        case 22:
          _context16.next = 28;
          break;

        case 24:
          _context16.prev = 24;
          _context16.t0 = _context16["catch"](10);
          _didIteratorError = true;
          _iteratorError = _context16.t0;

        case 28:
          _context16.prev = 28;
          _context16.prev = 29;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 31:
          _context16.prev = 31;

          if (!_didIteratorError) {
            _context16.next = 34;
            break;
          }

          throw _iteratorError;

        case 34:
          return _context16.finish(31);

        case 35:
          return _context16.finish(28);

        case 36:
          return _context16.abrupt("return", mapping);

        case 39:
          _context16.prev = 39;
          _context16.t1 = _context16["catch"](0);
          console.error("Error in addDrugATC:", _context16.t1);
          throw _context16.t1;

        case 43:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[0, 39], [10, 24, 28, 36], [29,, 31, 35]]);
};

var getDosageByDrugId = function getDosageByDrugId(DrugID) {
  var dosage, dosageFormMapping, dosageForm;
  return regeneratorRuntime.async(function getDosageByDrugId$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.prev = 0;
          _context17.next = 3;
          return regeneratorRuntime.awrap(Dosage.findOne({
            where: {
              DrugID: DrugID
            },
            attributes: ['DosageId', 'Numerator', 'NumeratorUnit']
          }));

        case 3:
          dosage = _context17.sent;

          if (dosage) {
            _context17.next = 6;
            break;
          }

          throw new Error("No dosage found for drug ID: ".concat(DrugID));

        case 6:
          _context17.next = 8;
          return regeneratorRuntime.awrap(DosageFormMapping.findOne({
            where: {
              DosageID: dosage.DosageId
            }
          }));

        case 8:
          dosageFormMapping = _context17.sent;

          if (dosageFormMapping) {
            _context17.next = 11;
            break;
          }

          throw new Error("No dosage form mapping found for dosage ID: ".concat(dosage.DosageId));

        case 11:
          _context17.next = 13;
          return regeneratorRuntime.awrap(DosageForm.findOne({
            where: {
              DosageFormID: dosageFormMapping.DosageFormId
            },
            attributes: ['Child']
          }));

        case 13:
          dosageForm = _context17.sent;

          if (dosageForm) {
            _context17.next = 16;
            break;
          }

          throw new Error("No dosage form found for ID: ".concat(dosageFormMapping.DosageFormId));

        case 16:
          return _context17.abrupt("return", {
            dosage: dosage,
            dosageForm: dosageForm
          });

        case 19:
          _context17.prev = 19;
          _context17.t0 = _context17["catch"](0);
          console.error("Error in getDosageByDrugId:", _context17.t0);
          throw new Error('Error occurred in getDosageByDrugId: ' + _context17.t0.message);

        case 23:
        case "end":
          return _context17.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

var getDosageByDrugName = function getDosageByDrugName(DrugName) {
  var _drug4;

  return regeneratorRuntime.async(function getDosageByDrugName$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          _context18.prev = 0;
          _context18.next = 3;
          return regeneratorRuntime.awrap(Drug.findOne({
            where: {
              DrugName: DrugName
            }
          }));

        case 3:
          _drug4 = _context18.sent;

          if (_drug4) {
            _context18.next = 6;
            break;
          }

          throw new Error("No drug found with name: ".concat(DrugName));

        case 6:
          return _context18.abrupt("return", getDosageByDrugId(_drug4.DrugID));

        case 9:
          _context18.prev = 9;
          _context18.t0 = _context18["catch"](0);
          console.error("Error in getDosageByDrugName:", _context18.t0);
          throw new Error('Error occurred in getDosageByDrugName: ' + _context18.t0.message);

        case 13:
        case "end":
          return _context18.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var getRouteByDrugId = function getRouteByDrugId(DrugID) {
  var drugRoute, route;
  return regeneratorRuntime.async(function getRouteByDrugId$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          _context19.prev = 0;
          _context19.next = 3;
          return regeneratorRuntime.awrap(DrugRoute.findOne({
            where: {
              DrugID: DrugID
            }
          }));

        case 3:
          drugRoute = _context19.sent;

          if (drugRoute) {
            _context19.next = 6;
            break;
          }

          throw new Error("No route found for drug ID: ".concat(DrugID));

        case 6:
          _context19.next = 8;
          return regeneratorRuntime.awrap(Route.findOne({
            where: {
              RouteID: drugRoute.RouteId
            },
            attributes: ['Name']
          }));

        case 8:
          route = _context19.sent;

          if (route) {
            _context19.next = 11;
            break;
          }

          throw new Error("No route name found for RouteID: ".concat(drugRoute.RouteId));

        case 11:
          return _context19.abrupt("return", route);

        case 14:
          _context19.prev = 14;
          _context19.t0 = _context19["catch"](0);
          console.error("Error in getRouteByDrugId:", _context19.t0);
          throw new Error('Error occurred in getRouteByDrugId: ' + _context19.t0.message);

        case 18:
        case "end":
          return _context19.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

var getRouteByDrugName = function getRouteByDrugName(DrugName) {
  var _drug5;

  return regeneratorRuntime.async(function getRouteByDrugName$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          _context20.prev = 0;
          _context20.next = 3;
          return regeneratorRuntime.awrap(Drug.findOne({
            where: {
              DrugName: DrugName
            }
          }));

        case 3:
          _drug5 = _context20.sent;

          if (_drug5) {
            _context20.next = 6;
            break;
          }

          throw new Error("No drug found with name: ".concat(DrugName));

        case 6:
          return _context20.abrupt("return", getRouteByDrugId(_drug5.DrugID));

        case 9:
          _context20.prev = 9;
          _context20.t0 = _context20["catch"](0);
          console.error("Error in getRouteByDrugName:", _context20.t0);
          throw new Error('Error occurred in getRouteByDrugName: ' + _context20.t0.message);

        case 13:
        case "end":
          return _context20.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var getPresentationByDrugId = function getPresentationByDrugId(DrugID) {
  var drugPresentation, presentationType;
  return regeneratorRuntime.async(function getPresentationByDrugId$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          _context21.prev = 0;
          _context21.next = 3;
          return regeneratorRuntime.awrap(DrugPresentation.findOne({
            where: {
              DrugId: DrugID
            },
            attributes: ['Amount', 'PackageType', 'TypeId']
          }));

        case 3:
          drugPresentation = _context21.sent;

          if (drugPresentation) {
            _context21.next = 6;
            break;
          }

          throw new Error("No presentation found for drug ID: ".concat(DrugID));

        case 6:
          _context21.next = 8;
          return regeneratorRuntime.awrap(PresentationType.findOne({
            where: {
              PresentationTypeId: drugPresentation.TypeId
            },
            attributes: ['Name']
          }));

        case 8:
          presentationType = _context21.sent;

          if (presentationType) {
            _context21.next = 11;
            break;
          }

          throw new Error("No presentation type found for ID: ".concat(drugPresentation.TypeId));

        case 11:
          return _context21.abrupt("return", _objectSpread({}, drugPresentation.get({
            plain: true
          }), {
            presentationType: presentationType
          }));

        case 14:
          _context21.prev = 14;
          _context21.t0 = _context21["catch"](0);
          console.error("Error in getPresentationByDrugId:", _context21.t0);
          throw new Error('Error occurred in getPresentationByDrugId: ' + _context21.t0.message);

        case 18:
        case "end":
          return _context21.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

var getPresentationByDrugName = function getPresentationByDrugName(DrugName) {
  var _drug6;

  return regeneratorRuntime.async(function getPresentationByDrugName$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          _context22.prev = 0;
          _context22.next = 3;
          return regeneratorRuntime.awrap(Drug.findOne({
            where: {
              DrugName: DrugName
            }
          }));

        case 3:
          _drug6 = _context22.sent;

          if (_drug6) {
            _context22.next = 6;
            break;
          }

          throw new Error("No drug found with name: ".concat(DrugName));

        case 6:
          return _context22.abrupt("return", getPresentationByDrugId(_drug6.DrugID));

        case 9:
          _context22.prev = 9;
          _context22.t0 = _context22["catch"](0);
          console.error("Error in getPresentationByDrugName:", _context22.t0);
          throw new Error('Error occurred in getPresentationByDrugName: ' + _context22.t0.message);

        case 13:
        case "end":
          return _context22.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var getStratumByDrugId = function getStratumByDrugId(DrugID) {
  var drugStratum, StratumTypeId, stratumType;
  return regeneratorRuntime.async(function getStratumByDrugId$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          _context23.prev = 0;
          _context23.next = 3;
          return regeneratorRuntime.awrap(DrugStratum.findOne({
            where: {
              DrugID: DrugID
            }
          }));

        case 3:
          drugStratum = _context23.sent;

          if (drugStratum) {
            _context23.next = 6;
            break;
          }

          throw new Error("No stratum mapping found for DrugID: ".concat(DrugID));

        case 6:
          // Get the stratumTypeId from the drugStratum
          StratumTypeId = drugStratum.StratumTypeId; // Get the stratumCode from the StratumType table

          _context23.next = 9;
          return regeneratorRuntime.awrap(StratumType.findOne({
            where: {
              stratumTypeId: StratumTypeId
            }
          }));

        case 9:
          stratumType = _context23.sent;

          if (stratumType) {
            _context23.next = 12;
            break;
          }

          throw new Error("No StratumType found for id: ".concat(stratumTypeId));

        case 12:
          return _context23.abrupt("return", stratumType.Code);

        case 15:
          _context23.prev = 15;
          _context23.t0 = _context23["catch"](0);
          throw new Error("Error in drugService: " + _context23.t0.message);

        case 18:
        case "end":
          return _context23.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

var checkMate = function checkMate(GTIN, BatchNumber, SerialNumber, ExpiryDate) {
  var _drug7, batchLot, batchSerialNumber;

  return regeneratorRuntime.async(function checkMate$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          console.log(GTIN.GTIN);
          console.log(GTIN.BatchNumber);
          _context24.prev = 2;
          _context24.next = 5;
          return regeneratorRuntime.awrap(Drug.findOne({
            where: {
              GTIN: GTIN.GTIN
            }
          }));

        case 5:
          _drug7 = _context24.sent;

          if (_drug7) {
            _context24.next = 8;
            break;
          }

          return _context24.abrupt("return", 'Checkmate');

        case 8:
          _context24.next = 10;
          return regeneratorRuntime.awrap(BatchLotTracking.findOne({
            where: {
              DrugId: _drug7.DrugID,
              BatchNumber: GTIN.BatchNumber
            }
          }));

        case 10:
          batchLot = _context24.sent;

          if (batchLot) {
            _context24.next = 13;
            break;
          }

          return _context24.abrupt("return", 'Checkmate');

        case 13:
          _context24.next = 15;
          return regeneratorRuntime.awrap(BatchSerialNumber.findOne({
            where: {
              BatchId: batchLot.BatchLotId,
              SerialNumber: GTIN.SerialNumber
            }
          }));

        case 15:
          batchSerialNumber = _context24.sent;

          if (batchSerialNumber) {
            _context24.next = 18;
            break;
          }

          return _context24.abrupt("return", 'Checkmate');

        case 18:
          return _context24.abrupt("return", 'Approved');

        case 21:
          _context24.prev = 21;
          _context24.t0 = _context24["catch"](2);
          console.error('Error in checkMate:', _context24.t0);
          throw _context24.t0;

        case 25:
        case "end":
          return _context24.stop();
      }
    }
  }, null, null, [[2, 21]]);
};

var getOTCDrugs = function getOTCDrugs() {
  var drugs, drugsWithDosageAndRoute;
  return regeneratorRuntime.async(function getOTCDrugs$(_context26) {
    while (1) {
      switch (_context26.prev = _context26.next) {
        case 0:
          _context26.prev = 0;
          _context26.next = 3;
          return regeneratorRuntime.awrap(Drug.findAll({
            where: {
              isOTC: true
            },
            attributes: ['DrugName', 'DrugNameAR', 'ManufacturerID', 'ProductType', 'Price', 'ATCRelatedIngredient', 'ImagesPath', 'SubsidyPercentage', 'NotMarketed']
          }));

        case 3:
          drugs = _context26.sent;
          _context26.next = 6;
          return regeneratorRuntime.awrap(Promise.all(drugs.map(function _callee6(drug) {
            var dosage, route, presentation, Manufacturer, ManufacturerName, CountryName, priceInLBP, unitPrice, unitPriceInLBP;
            return regeneratorRuntime.async(function _callee6$(_context25) {
              while (1) {
                switch (_context25.prev = _context25.next) {
                  case 0:
                    _context25.next = 2;
                    return regeneratorRuntime.awrap(getDosageByDrugName(drug.DrugName));

                  case 2:
                    dosage = _context25.sent;
                    _context25.next = 5;
                    return regeneratorRuntime.awrap(getRouteByDrugName(drug.DrugName));

                  case 5:
                    route = _context25.sent;
                    _context25.next = 8;
                    return regeneratorRuntime.awrap(getPresentationByDrugName(drug.DrugName));

                  case 8:
                    presentation = _context25.sent;
                    _context25.next = 11;
                    return regeneratorRuntime.awrap(Agent.findOne({
                      where: {
                        AgentID: drug.ManufacturerID
                      }
                    }));

                  case 11:
                    Manufacturer = _context25.sent;
                    ManufacturerName = Manufacturer.AgentName;
                    CountryName = Manufacturer.Country;
                    priceInLBP = drug.Price * 90000;
                    unitPrice = drug.Price / presentation.Amount;
                    unitPriceInLBP = unitPrice * 90000;
                    return _context25.abrupt("return", _objectSpread({}, drug.dataValues, {
                      dosage: dosage,
                      route: route,
                      presentation: presentation,
                      ManufacturerName: ManufacturerName,
                      CountryName: CountryName,
                      priceInLBP: priceInLBP,
                      unitPrice: unitPrice,
                      unitPriceInLBP: unitPriceInLBP
                    }));

                  case 18:
                  case "end":
                    return _context25.stop();
                }
              }
            });
          })));

        case 6:
          drugsWithDosageAndRoute = _context26.sent;
          return _context26.abrupt("return", drugsWithDosageAndRoute);

        case 10:
          _context26.prev = 10;
          _context26.t0 = _context26["catch"](0);
          console.error("Error in getOTCDrugs:", _context26.t0);
          throw new Error('Error occurred in getOTCDrugs: ' + _context26.t0.message);

        case 14:
        case "end":
          return _context26.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

module.exports = {
  searchDrugByATCName: searchDrugByATCName,
  searchDrugByName: searchDrugByName,
  smartSearch: smartSearch,
  getDrugById: getDrugById,
  filterDrugs: filterDrugs,
  addDrug: addDrug,
  addPharmacyDrug: addPharmacyDrug,
  getAllDrugs: getAllDrugs,
  getDrugByATCLevel: getDrugByATCLevel,
  addDrugATC: addDrugATC,
  getDosageByDrugId: getDosageByDrugId,
  getDosageByDrugName: getDosageByDrugName,
  getRouteByDrugId: getRouteByDrugId,
  getRouteByDrugName: getRouteByDrugName,
  getPresentationByDrugId: getPresentationByDrugId,
  getPresentationByDrugName: getPresentationByDrugName,
  checkMate: checkMate,
  getOTCDrugs: getOTCDrugs,
  getDrugByDiseaseCategory: getDrugByDiseaseCategory
};