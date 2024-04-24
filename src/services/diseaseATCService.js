const DiseaseCategoryATC = require('../models/diseaseCategoryAtc');
const drugService = require('./drugService');
const atcService = require('./atcService');
const diseaseATCService = require('./diseaseATCService');
const addDiseaseCategoryATC = async (diseaseCategoryAtcData) => {
    const diseaseCategoryAtc = await DiseaseCategoryATC.create(diseaseCategoryAtcData);
    return diseaseCategoryAtc;
};

const getAllDiseaseCategoryATCs = async () => {
    const diseaseCategoryAtcs = await DiseaseCategoryATC.findAll();
    return diseaseCategoryAtcs;
};

const getDiseaseCategoryATCById = async (id) => {
    const diseaseCategoryAtc = await DiseaseCategoryATC.findByPk(id);
    return diseaseCategoryAtc;
};

const updateDiseaseCategoryATC = async (id, diseaseCategoryAtcData) => {
    const diseaseCategoryAtc = await DiseaseCategoryATC.update(diseaseCategoryAtcData, {
        where: { MappingId: id }
    });
    return diseaseCategoryAtc;
};

const deleteDiseaseCategoryATC = async (id) => {
    const diseaseCategoryAtc = await DiseaseCategoryATC.destroy({
        where: { MappingId: id }
    });
    return diseaseCategoryAtc;
};


const getDiseaseByDrugName = async (drugName) => {
    const drug = await drugService.searchDrugByName(drugName);
    const atcCode = await atcService.getATCByDrugID(drug.DrugID);
    const diseaseCategoryAtcs = await diseaseATCService.getAllDiseaseCategoryATCs();

    const diseases = diseaseCategoryAtcs.filter(diseaseCategoryAtc => diseaseCategoryAtc.ATC_ID === atcCode.ATC_ID);
    return diseases;
};

const getDrugsByDiseaseCategoryName = async (diseaseCategoryName) => {
    const diseaseCategoryAtcs = await diseaseATCService.getAllDiseaseCategoryATCs();
    const atcCodes = diseaseCategoryAtcs.filter(diseaseCategoryAtc => diseaseCategoryAtc.DiseaseCategoryName === diseaseCategoryName);

    const drugs = [];
    for (const atcCode of atcCodes) {
        const drugsForAtcCode = await drugService.searchDrugByATCName(atcCode.ATCName);
        drugs.push(...drugsForAtcCode);
    }

    return drugs;
};
module.exports = {
    addDiseaseCategoryATC,
    getAllDiseaseCategoryATCs,
    getDiseaseCategoryATCById,
    updateDiseaseCategoryATC,
    deleteDiseaseCategoryATC,
    getDiseaseByDrugName,
    getDrugsByDiseaseCategoryName
};