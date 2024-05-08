const Drug_ATC_Mapping = require("../models/atcMapping");
const ATC_Code = require("../models/atc");

const getATCByDrugID = async (DrugID) => {
  try {
    const mapping = await Drug_ATC_Mapping.findOne({
      where: { DrugID: DrugID },
    });

    if (!mapping) {
      throw new Error(`No ATC mapping found for drug ID: ${DrugID}`);
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
const addATC = async (atcData) => {
  try {
    const atcCode = await ATC_Code.create(atcData);
    return atcCode;
  } catch (error) {
    console.error(error);
    throw new Error("Error in addATC service: " + error.message);
  }
};

const editATC = async (atcId, atcData) => {
  try {
    const atcCode = await ATC_Code.update(atcData, {
      where: { ATC_ID: atcId },
    });
    return atcCode;
  } catch (error) {
    console.error(error);
    throw new Error("Error in editATC service: " + error.message);
  }
};

const deleteATC = async (atcId) => {
  try {
    await ATC_Code.destroy({
      where: { ATC_ID: atcId },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error in deleteATC service: " + error.message);
  }
};

const getAllATC = async () => {
  try {
    const allATC = await ATC_Code.findAll();
    return allATC;
  } catch (error) {
    console.error(error);
    throw new Error("Error in getAllATC service: " + error.message);
  }
};

module.exports = {
  getATCByDrugID,
  addATC,
  editATC,
  deleteATC,
  getAllATC
};
