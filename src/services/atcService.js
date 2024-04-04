// const Drug_ATC_Mapping = require('../models/AtcMapping');
// const ATC_Code = require('../models/ATC');

// const getATCByDrugID = async (drugID) => {
//     try {
//         const mapping = await Drug_ATC_Mapping.findOne({
//             where: { DrugID: drugID }
//         });

//         if (!mapping) {
//             throw new Error(`No ATC mapping found for drug ID: ${drugID}`);
//         }

//         const atcCode = await ATC_Code.findOne({
//             where: { ATC_ID: mapping.ATC_ID }
//         });

//         if (!atcCode) {
//             throw new Error(`No ATC code found for ID: ${mapping.ATC_ID}`);
//         }

//         return atcCode;
//     } catch (error) {
//         console.error(error);
//         throw new Error('Error in getATCByDrugID service: ' + error.message);
//     }
// };

// const getAllATCCodes = async () => {
//     try {
//         const allATCCodes = await ATC_Code.findAll();
//         return allATCCodes;
//     } catch (error) {
//         console.error(error);
//         throw new Error('Error in getAllATCCodes service: ' + error.message);
//     }
// };

// module.exports = {
//     getATCByDrugID,
//     getAllATCCodes
// };

// ---------------------------------------------------------------

const Drug_ATC_Mapping = require("../models/AtcMapping");
const ATC_Code = require("../models/ATC");

const getATCByDrugID = async (drugID) => {
  try {
    const mapping = await Drug_ATC_Mapping.findOne({
      where: { DrugID: drugID },
    });

    if (!mapping) {
      throw new Error(`No ATC mapping found for drug ID: ${drugID}`);
    }

    const atcCode = await ATC_Code.findOne({
      where: { ATC_ID: mapping.ATC_ID },
    });

    if (!atcCode) {
      throw new Error(`No ATC code found for ID: ${mapping.ATC_ID}`);
    }

    return atcCode;
  } catch (error) {
    console.error(error);
    throw new Error("Error in getATCByDrugID service: " + error.message);
  }
};

const getAllATCCodes = async () => {
  try {
    const allATCCodes = await ATC_Code.findAll();
    return allATCCodes;
  } catch (error) {
    console.error(error);
    throw new Error("Error in getAllATCCodes service: " + error.message);
  }
};

const createATCCode = async ({ Code, Name, Description, ParentID }) => {
  try {
    const newATCCode = await ATC_Code.create({
      Code,
      Name,
      Description,
      ParentID,
    });
    return newATCCode;
  } catch (error) {
    console.error(error);
    throw new Error("Error in createATCCode service: " + error.message);
  }
};

const deleteATCCode = async (id) => {
  try {
    const deletedATCCode = await ATC_Code.destroy({ where: { ATC_ID: id } });
    return deletedATCCode;
  } catch (error) {
    console.error(error);
    throw new Error("Error in deleteATCCode service: " + error.message);
  }
};

module.exports = {
  getATCByDrugID,
  getAllATCCodes,
  createATCCode,
  deleteATCCode,
};
