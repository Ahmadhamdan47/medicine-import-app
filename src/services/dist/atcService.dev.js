"use strict";

var Drug_ATC_Mapping = require("../models/atcMapping");

var ATC_Code = require("../models/ATC");

var getATCByDrugID = function getATCByDrugID(DrugID) {
  var mapping, atcCode;
  return regeneratorRuntime.async(function getATCByDrugID$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Drug_ATC_Mapping.findOne({
            where: {
              DrugID: DrugID
            }
          }));

        case 3:
          mapping = _context.sent;

          if (mapping) {
            _context.next = 6;
            break;
          }

          throw new Error("No ATC mapping found for drug ID: ".concat(DrugID));

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(ATC_Code.findOne({
            where: {
              ATC_ID: mapping.ATC_ID
            }
          }));

        case 8:
          atcCode = _context.sent;

          if (atcCode) {
            _context.next = 11;
            break;
          }

          throw new Error("No ATC code found for ID: ".concat(mapping.ATC_ID));

        case 11:
          return _context.abrupt("return", atcCode);

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          throw new Error("Error in getATCByDrugID service: " + _context.t0.message);

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

var addATC = function addATC(atcData) {
  var atcCode;
  return regeneratorRuntime.async(function addATC$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(ATC_Code.create(atcData));

        case 3:
          atcCode = _context2.sent;
          return _context2.abrupt("return", atcCode);

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          throw new Error("Error in addATC service: " + _context2.t0.message);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var editATC = function editATC(atcId, atcData) {
  var atcCode;
  return regeneratorRuntime.async(function editATC$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(ATC_Code.update(atcData, {
            where: {
              ATC_ID: atcId
            }
          }));

        case 3:
          atcCode = _context3.sent;
          return _context3.abrupt("return", atcCode);

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          throw new Error("Error in editATC service: " + _context3.t0.message);

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var deleteATC = function deleteATC(atcId) {
  return regeneratorRuntime.async(function deleteATC$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(ATC_Code.destroy({
            where: {
              ATC_ID: atcId
            }
          }));

        case 3:
          _context4.next = 9;
          break;

        case 5:
          _context4.prev = 5;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          throw new Error("Error in deleteATC service: " + _context4.t0.message);

        case 9:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 5]]);
};

var getAllATC = function getAllATC() {
  var allATC;
  return regeneratorRuntime.async(function getAllATC$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(ATC_Code.findAll());

        case 3:
          allATC = _context5.sent;
          return _context5.abrupt("return", allATC);

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          throw new Error("Error in getAllATC service: " + _context5.t0.message);

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

module.exports = {
  getATCByDrugID: getATCByDrugID,
  addATC: addATC,
  editATC: editATC,
  deleteATC: deleteATC,
  getAllATC: getAllATC
};