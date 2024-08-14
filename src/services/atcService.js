const drug_atc_mapping = require("../models/atcmapping");
const ATC_Code = require("../models/atc");
const Drug = require("../models/pharmacyDrug");


const getATCByDrugID = async (DrugID) => {
  try {
    const mapping = await drug_atc_mapping.findOne({
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

  
const addATCMapping = async (Code, DrugName) => {
  try {
    // Find the ATC_ID from the ATC_Code table
    const atc = await ATC_Code.findOne({
      where: { Code: Code },
    });

    if (!atc) {
      throw new Error(`No ATC code found for code: ${Code}`);
    }

    // Find the DrugID from the Drug table
    const drug = await Drug.findOne({
      where: { DrugName: DrugName },
    });

    if (!drug) {
      throw new Error(`No drug found for name: ${DrugName}`);
    }

    // Add the ATC_ID and DrugID to the drug_atc_mapping table
    const mapping = await drug_atc_mapping.create({
      ATC_ID: atc.ATC_ID,
      DrugID: drug.DrugID,
    });

    return mapping;
  } catch (error) {
    console.error(error);
    throw new Error("Error in addATCMapping service: " + error.message);
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
  getAllATC,
  addATCMapping,
};
