

const Drug_ATC_Mapping = require('../models/AtcMapping');
const ATC_Code = require('../models/AtcCode');

const getATCByDrugID = async (drugID) => {
    try {
        const mapping = await Drug_ATC_Mapping.findOne({
            where: { DrugID: drugID }
        });

        if (!mapping) {
            throw new Error(`No ATC mapping found for drug ID: ${drugID}`);
        }

        const atcCode = await ATC_Code.findOne({
            where: { ATC_ID: mapping.ATC_ID }
        });

        if (!atcCode) {
            throw new Error(`No ATC code found for ID: ${mapping.ATC_ID}`);
        }

        return atcCode;
    } catch (error) {
        console.error(error);
        throw new Error('Error in getATCByDrugID service: ' + error.message);
    }
};

module.exports = {
    getATCByDrugID
};