const DiseaseCategoryATC = require('../models/diseaseCategoryAtc');
const DiseaseCategory = require('../models/diseaseCategory');

const drugService = require('./drugService');
const atcService = require('./atcService');

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
    const diseaseCategoryAtcs = await getAllDiseaseCategoryATCs();

    const diseases = diseaseCategoryAtcs.filter(diseaseCategoryAtc => diseaseCategoryAtc.ATC_ID === atcCode.ATC_ID);
    return diseases;
};

const getDrugsByDiseaseCategoryName = async (diseaseCategoryName) => {
    // 1️⃣ Fetch Disease Category ID from its name
    const diseaseCategory = await DiseaseCategory.findOne({
        where: { CategoryName: diseaseCategoryName }
    });

    if (!diseaseCategory) {
        console.log(`No disease category found for: ${diseaseCategoryName}`);
        return [];
    }

    console.log("✅ Found Disease Category:", diseaseCategory);

    // 2️⃣ Get all mappings for this DiseaseCategoryId
    const diseaseCategoryAtcs = await DiseaseCategoryATC.findAll({
        where: { DiseaseCategoryId: diseaseCategory.DiseaseCategoryId }
    });

    if (!diseaseCategoryAtcs.length) {
        console.log(`❌ No ATC codes found for disease category ID: ${diseaseCategory.DiseaseCategoryId}`);
        return [];
    }

    console.log("✅ Found DiseaseCategoryATCs:", diseaseCategoryAtcs);

    const drugs = [];

    for (const mapping of diseaseCategoryAtcs) {
        // 3️⃣ Fetch the ATC code associated with the mapping
        const atcCode = await atcService.getATCById(mapping.ATC_CodeId);
        if (!atcCode) continue;

        console.log("✅ Found ATC Code:", atcCode);

        // 4️⃣ Fetch drugs using ATC name
        const drugsForAtcCode = await drugService.searchDrugByATCName(atcCode.Code);
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