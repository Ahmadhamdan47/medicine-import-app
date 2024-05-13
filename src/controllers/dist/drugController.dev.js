"use strict";

var DrugService = require("../services/drugService");

var addPharmacyDrug = function addPharmacyDrug(req, res) {
  var drugData, newDrug;
  return regeneratorRuntime.async(function addPharmacyDrug$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          drugData = req.body;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(DrugService.addPharmacyDrug(drugData));

        case 4:
          newDrug = _context.sent;
          res.json(newDrug);
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          res.status(500).json({
            error: _context.t0.toString()
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

var addDrug = function addDrug(req, res) {
  var drugData, newDrug;
  return regeneratorRuntime.async(function addDrug$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          drugData = req.body;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(DrugService.addDrug(drugData));

        case 4:
          newDrug = _context2.sent;
          res.json(newDrug);
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](1);
          res.status(500).json({
            error: _context2.t0.toString()
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

var searchDrugByATCName = function searchDrugByATCName(req, res) {
  var query, result;
  return regeneratorRuntime.async(function searchDrugByATCName$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          query = req.params.query;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(DrugService.searchDrugByATCName(query));

        case 4:
          result = _context3.sent;
          res.json(result);
          _context3.next = 11;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](1);
          res.status(500).json({
            error: "Internal Server Error"
          });

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

var searchDrugByName = function searchDrugByName(req, res) {
  var query, result;
  return regeneratorRuntime.async(function searchDrugByName$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          query = req.params.query;
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(DrugService.searchDrugByName(query));

        case 4:
          result = _context4.sent;
          res.json(result);
          _context4.next = 11;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](1);
          res.status(500).json({
            error: "Internal Server Error"
          });

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

var getDrugById = function getDrugById(req, res) {
  var DrugID, drug;
  return regeneratorRuntime.async(function getDrugById$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          DrugID = req.params.DrugID;
          _context5.next = 4;
          return regeneratorRuntime.awrap(DrugService.getDrugById(DrugID));

        case 4:
          drug = _context5.sent;

          if (drug) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            error: "Drug not found"
          }));

        case 7:
          res.json(drug);
          _context5.next = 13;
          break;

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json({
            error: _context5.t0.toString()
          });

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var filterDrugs = function filterDrugs(req, res) {
  var query, searchResults, filteredResults;
  return regeneratorRuntime.async(function filterDrugs$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          query = req.params.query;
          _context6.prev = 1;
          _context6.next = 4;
          return regeneratorRuntime.awrap(DrugService.searchDrugByATCName(query));

        case 4:
          searchResults = _context6.sent;
          _context6.next = 7;
          return regeneratorRuntime.awrap(DrugService.filterDrugs(searchResults));

        case 7:
          filteredResults = _context6.sent;
          res.json(filteredResults);
          _context6.next = 14;
          break;

        case 11:
          _context6.prev = 11;
          _context6.t0 = _context6["catch"](1);
          res.status(500).json({
            error: "Internal Server Error"
          });

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[1, 11]]);
};

var getAllDrugs = function getAllDrugs(req, res, next) {
  var drugs;
  return regeneratorRuntime.async(function getAllDrugs$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(DrugService.getAllDrugs());

        case 3:
          drugs = _context7.sent;
          res.status(200).json(drugs);
          _context7.next = 10;
          break;

        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          next(_context7.t0);

        case 10:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var smartSearch = function smartSearch(req, res) {
  var searchTerm, results;
  return regeneratorRuntime.async(function smartSearch$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          searchTerm = req.params.query;
          _context8.prev = 1;
          _context8.next = 4;
          return regeneratorRuntime.awrap(DrugService.smartSearch(searchTerm));

        case 4:
          results = _context8.sent;
          res.json(results);
          _context8.next = 11;
          break;

        case 8:
          _context8.prev = 8;
          _context8.t0 = _context8["catch"](1);
          res.status(500).json({
            error: "Internal Server Error"
          });

        case 11:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

var getDrugByATCLevel = function getDrugByATCLevel(req, res) {
  var query, drugs;
  return regeneratorRuntime.async(function getDrugByATCLevel$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          query = req.params.query;
          _context9.prev = 1;
          _context9.next = 4;
          return regeneratorRuntime.awrap(DrugService.getDrugByATCLevel(query));

        case 4:
          drugs = _context9.sent;
          res.json(drugs);
          _context9.next = 11;
          break;

        case 8:
          _context9.prev = 8;
          _context9.t0 = _context9["catch"](1);
          res.status(500).json({
            error: "Internal Server Error"
          });

        case 11:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

var addDrugATC = function addDrugATC(req, res) {
  var _req$body, DrugID, ATC_ID, newMapping;

  return regeneratorRuntime.async(function addDrugATC$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _req$body = req.body, DrugID = _req$body.DrugID, ATC_ID = _req$body.ATC_ID;
          _context10.prev = 1;
          _context10.next = 4;
          return regeneratorRuntime.awrap(DrugService.addDrugATC(DrugID, ATC_ID));

        case 4:
          newMapping = _context10.sent;
          res.json(newMapping);
          _context10.next = 11;
          break;

        case 8:
          _context10.prev = 8;
          _context10.t0 = _context10["catch"](1);

          // Handle the error when the drug is already a substitute
          if (_context10.t0.message === 'Drug is already a substitute') {
            res.status(400).json({
              error: _context10.t0.message
            });
          } else {
            res.status(500).json({
              error: _context10.t0.toString()
            });
          }

        case 11:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

var getDosageByDrugId = function getDosageByDrugId(req, res) {
  var dosage;
  return regeneratorRuntime.async(function getDosageByDrugId$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return regeneratorRuntime.awrap(drugService.getDosageByDrugId(req.params.drugId));

        case 3:
          dosage = _context11.sent;
          res.json(dosage);
          _context11.next = 10;
          break;

        case 7:
          _context11.prev = 7;
          _context11.t0 = _context11["catch"](0);
          res.status(500).json({
            error: _context11.t0.toString()
          });

        case 10:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var getDosageByDrugName = function getDosageByDrugName(req, res) {
  var dosage;
  return regeneratorRuntime.async(function getDosageByDrugName$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _context12.next = 3;
          return regeneratorRuntime.awrap(drugService.getDosageByDrugName(req.params.drugName));

        case 3:
          dosage = _context12.sent;
          res.json(dosage);
          _context12.next = 10;
          break;

        case 7:
          _context12.prev = 7;
          _context12.t0 = _context12["catch"](0);
          res.status(500).json({
            error: _context12.t0.toString()
          });

        case 10:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var getRouteByDrugId = function getRouteByDrugId(req, res) {
  var route;
  return regeneratorRuntime.async(function getRouteByDrugId$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          _context13.next = 3;
          return regeneratorRuntime.awrap(drugService.getRouteByDrugId(req.params.drugId));

        case 3:
          route = _context13.sent;
          res.json(route);
          _context13.next = 10;
          break;

        case 7:
          _context13.prev = 7;
          _context13.t0 = _context13["catch"](0);
          res.status(500).json({
            error: _context13.t0.toString()
          });

        case 10:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var getRouteByDrugName = function getRouteByDrugName(req, res) {
  var route;
  return regeneratorRuntime.async(function getRouteByDrugName$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          _context14.next = 3;
          return regeneratorRuntime.awrap(drugService.getRouteByDrugName(req.params.drugName));

        case 3:
          route = _context14.sent;
          res.json(route);
          _context14.next = 10;
          break;

        case 7:
          _context14.prev = 7;
          _context14.t0 = _context14["catch"](0);
          res.status(500).json({
            error: _context14.t0.toString()
          });

        case 10:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var getPresentationByDrugId = function getPresentationByDrugId(req, res) {
  var presentation;
  return regeneratorRuntime.async(function getPresentationByDrugId$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          _context15.next = 3;
          return regeneratorRuntime.awrap(drugService.getPresentationByDrugId(req.params.drugId));

        case 3:
          presentation = _context15.sent;
          res.json(presentation);
          _context15.next = 10;
          break;

        case 7:
          _context15.prev = 7;
          _context15.t0 = _context15["catch"](0);
          res.status(500).json({
            message: _context15.t0.message
          });

        case 10:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var getPresentationByDrugName = function getPresentationByDrugName(req, res) {
  var presentation;
  return regeneratorRuntime.async(function getPresentationByDrugName$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.prev = 0;
          _context16.next = 3;
          return regeneratorRuntime.awrap(drugService.getPresentationByDrugName(req.params.drugName));

        case 3:
          presentation = _context16.sent;
          res.json(presentation);
          _context16.next = 10;
          break;

        case 7:
          _context16.prev = 7;
          _context16.t0 = _context16["catch"](0);
          res.status(500).json({
            message: _context16.t0.message
          });

        case 10:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var getStratumByDrugId = function getStratumByDrugId(req, res) {
  var DrugID, stratum;
  return regeneratorRuntime.async(function getStratumByDrugId$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.prev = 0;
          DrugID = req.params.DrugID;
          _context17.next = 4;
          return regeneratorRuntime.awrap(DrugService.getStratumByDrugId(DrugID));

        case 4:
          stratum = _context17.sent;

          if (stratum) {
            _context17.next = 7;
            break;
          }

          return _context17.abrupt("return", res.status(404).json({
            error: "Stratum not found"
          }));

        case 7:
          res.json(stratum);
          _context17.next = 13;
          break;

        case 10:
          _context17.prev = 10;
          _context17.t0 = _context17["catch"](0);
          res.status(500).json({
            error: _context17.t0.toString()
          });

        case 13:
        case "end":
          return _context17.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var checkMate = function checkMate(req, res) {
  var result;
  return regeneratorRuntime.async(function checkMate$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          _context18.prev = 0;
          _context18.next = 3;
          return regeneratorRuntime.awrap(DrugService.checkMate(req.body));

        case 3:
          result = _context18.sent;
          res.json({
            message: result
          });
          _context18.next = 10;
          break;

        case 7:
          _context18.prev = 7;
          _context18.t0 = _context18["catch"](0);
          res.status(500).json({
            error: _context18.t0.toString()
          });

        case 10:
        case "end":
          return _context18.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var getOTCDrugs = function getOTCDrugs(req, res) {
  var otcDrugs;
  return regeneratorRuntime.async(function getOTCDrugs$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          _context19.prev = 0;
          _context19.next = 3;
          return regeneratorRuntime.awrap(DrugService.getOTCDrugs());

        case 3:
          otcDrugs = _context19.sent;
          res.json(otcDrugs);
          _context19.next = 10;
          break;

        case 7:
          _context19.prev = 7;
          _context19.t0 = _context19["catch"](0);
          res.status(500).json({
            error: _context19.t0.toString()
          });

        case 10:
        case "end":
          return _context19.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // drugController.js


var getDrugByDiseaseCategoryController = function getDrugByDiseaseCategoryController(req, res) {
  var categoryName, drugs;
  return regeneratorRuntime.async(function getDrugByDiseaseCategoryController$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          categoryName = req.params.categoryName;
          _context20.next = 3;
          return regeneratorRuntime.awrap(DrugService.getDrugByDiseaseCategory(categoryName));

        case 3:
          drugs = _context20.sent;
          res.json(drugs);

        case 5:
        case "end":
          return _context20.stop();
      }
    }
  });
};

module.exports = {
  searchDrugByATCName: searchDrugByATCName,
  searchDrugByName: searchDrugByName,
  getDrugById: getDrugById,
  filterDrugs: filterDrugs,
  addDrug: addDrug,
  addPharmacyDrug: addPharmacyDrug,
  getAllDrugs: getAllDrugs,
  smartSearch: smartSearch,
  getDrugByATCLevel: getDrugByATCLevel,
  addDrugATC: addDrugATC,
  getDosageByDrugId: getDosageByDrugId,
  getDosageByDrugName: getDosageByDrugName,
  getRouteByDrugId: getRouteByDrugId,
  getRouteByDrugName: getRouteByDrugName,
  getPresentationByDrugId: getPresentationByDrugId,
  getPresentationByDrugName: getPresentationByDrugName,
  getStratumByDrugId: getStratumByDrugId,
  checkMate: checkMate,
  getOTCDrugs: getOTCDrugs,
  getDrugByDiseaseCategoryController: getDrugByDiseaseCategoryController
};