const ATC_Code = require("../models/atc");
const drug_atc_mapping = require("../models/atcmapping");
const substituteService = require("../services/substituteService");

const addSubstitutesForSameATC = async () => {
  try {
    // Fetch all ATC codes
    const atcCodes = await ATC_Code.findAll();

    // Iterate over each ATC code
    for (const atc of atcCodes) {
      // Fetch all drugs mapped to the current ATC code
      const mappings = await drug_atc_mapping.findAll({
        where: { ATC_ID: atc.ATC_ID },
      });

      // Get all DrugIDs from the mappings
      const drugIDs = mappings.map((mapping) => mapping.DrugID);

      // Iterate over each drug
      for (const drugID of drugIDs) {
        // Add all other drugs as substitutes to the current drug
        for (const substituteID of drugIDs) {
          if (drugID !== substituteID) {
            await substituteService.addSubstitute(drugID, substituteID);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in addSubstitutesForSameATC:", error);
    throw error;
  }
};

addSubstitutesForSameATC();