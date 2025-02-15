const fs = require('fs');

const DrugService = require("../services/drugService");

const addPharmacyDrug = async (req, res) => {
  const drugData = req.body;

  try {
    const newDrug = await DrugService.addPharmacyDrug(drugData);
    res.json(newDrug);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const addDrug = async (req, res) => {
  const drugData = req.body;

  try {
    const newDrug = await DrugService.addDrug(drugData);
    res.json(newDrug);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const searchDrugByATCName = async (req, res) => {
  const query = req.params.query;

  try {
    const result = await DrugService.searchDrugByATCName(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const searchDrugByName = async (req, res) => {
  const query = req.params.query;

  try {
    const result = await DrugService.searchDrugByName(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getDrugById = async (req, res) => {
  try {
    const { DrugID } = req.params;
    const drugs = await DrugService.getDrugById(DrugID);

    if (!drugs || !drugs.length) {
      return res.status(404).json({ error: "Drugs not found" });
    }

    res.json(drugs);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const filterDrugs = async (req, res) => {
  const query = req.params.query;

  try {
    const searchResults = await DrugService.searchDrugByATCName(query);
    const filteredResults = await DrugService.filterDrugs(searchResults);
    res.json(filteredResults);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllDrugs = async (req, res, next) => {
  try {
    const drugs = await DrugService.getAllDrugs();
    res.status(200).json(drugs);
  } catch (error) {
    next(error);
  }
};
const getAllDrugsPaginated = async (req, res, next) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const { drugs, totalPages } = await DrugService.getAllDrugsPaginated(parseInt(page, 10), parseInt(limit, 10));
    res.status(200).json({ drugs, totalPages });
  } catch (error) {
    next(error);
  }
};
const getAllDrugsPaginatedByATC = async (req, res, next) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const { drugs, totalPages } = await DrugService.getAllDrugsPaginatedByATC(parseInt(page, 10), parseInt(limit, 10));
    res.status(200).json({ drugs, totalPages });
  } catch (error) {
    next(error);
  }
};
const smartSearch = async (req, res) => {
  const searchTerm = req.params.query;

  try {
    const results = await DrugService.smartSearch(searchTerm);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getDrugByATCLevel = async (req, res) => {
  const query = req.params.query;

  try {
    const drugs = await DrugService.getDrugByATCLevel(query);
    res.json(drugs);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const addDrugATC = async (req, res) => {
  const { DrugID, ATC_ID } = req.body;

  try {
    const newMapping = await DrugService.addDrugATC(DrugID, ATC_ID);
    res.json(newMapping);
  } catch (error) {
    // Handle the error when the drug is already a substitute
    if (error.message === 'Drug is already a substitute') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.toString() });
    }
  }
};
const getDosageByDrugId = async (req, res) => {
  try {
      const dosage = await drugService.getDosageByDrugId(req.params.drugId);
      res.json(dosage);
  } catch (error) {
      res.status(500).json({ error: error.toString() });
  }
};

const getDosageByDrugName = async (req, res) => {
  try {
      const dosage = await drugService.getDosageByDrugName(req.params.drugName);
      res.json(dosage);
  } catch (error) {
      res.status(500).json({ error: error.toString() });
  }
};

const getRouteByDrugId = async (req, res) => {
  try {
      const route = await drugService.getRouteByDrugId(req.params.drugId);
      res.json(route);
  } catch (error) {
      res.status(500).json({ error: error.toString() });
  }
};

const getRouteByDrugName = async (req, res) => {
  try {
      const route = await drugService.getRouteByDrugName(req.params.drugName);
      res.json(route);
  } catch (error) {
      res.status(500).json({ error: error.toString() });
  }
};
const getPresentationByDrugId = async (req, res) => {
  try {
    const presentation = await drugService.getPresentationByDrugId(req.params.drugId);
    res.json(presentation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPresentationByDrugName = async (req, res) => {
  try {
    const presentation = await drugService.getPresentationByDrugName(req.params.drugName);
    res.json(presentation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getStratumByDrugId = async (req, res) => {
  try {
    const { DrugID } = req.params;
    const stratum = await DrugService.getStratumByDrugId(DrugID);

    if (!stratum) {
      return res.status(404).json({ error: "Stratum not found" });
    }

    res.json(stratum);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};
const checkMate = async (req, res) => {
  try {
    const result = await DrugService.checkMate(req.body);
    res.json({ message: result });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};
const getOTCDrugs = async (req, res) => {
  try {
    const otcDrugs = await DrugService.getOTCDrugs();
    res.json(otcDrugs);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};
// drugController.js


const getDrugByDiseaseCategoryController = async (req, res) => {
  const { categoryName } = req.params;
  const drugs = await DrugService.getDrugByDiseaseCategory(categoryName);
  res.json(drugs);
};
const getDrugSubstitutesController = async (req, res, next) => {
  try {
    const { drugName } = req.params;
    const substitutes = await DrugService.getDrugSubstitutes(drugName);
    res.json(substitutes);
  } catch (error) {
    next(error);
  }
};
const checkDrugNameInAPI = async (req, res) => {
  const drugName = req.params.drugName;
  const result = await DrugService.checkDrugNameInAPI(drugName);
  res.json({ exists: result });
};

const deleteDrug = async (req, res) => {
  const { DrugID } = req.params;
  try {
    const drug = await DrugService.deleteDrug(DrugID);
    res.json(drug);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};
const updateDrug = async (req, res) => {
  const { DrugID } = req.params;
  const drugData = req.body;
  try {
    const drug = await DrugService.updateDrug(DrugID, drugData);
    res.json(drug);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};
const deleteDosagesByDrugId = async (req, res) => {
  const { DrugID } = req.params;
  try {
    await DrugService.deleteDosagesByDrugId(DrugID);
    res.json({ message: 'Dosages deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};
const deletePresentationsByDrugId = async (req, res) => {
  const { DrugID } = req.params;
  try {
    await DrugService.deletePresentationsByDrugId(DrugID);
    res.json({ message: 'Presentations deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};
const fetchDrugData = async (req, res) => {
  try {
    // Call the service to fetch data from the server
    const drugs = await DrugService.fetchDrugDataFromServer();

    // Return the fetched data as a JSON response
    return res.status(200).json({
      success: true,
      data: drugs,
    });
  } catch (error) {
    console.error('Error in fetchDrugData controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch drug data from the server.',
      error: error.message
    });
  }
};
const checkForUpdates = async (req, res) => {
  try {
    const drugsNeedingUpdate = await DrugService.checkForDrugUpdates();
    return res.status(200).json({ success: true, data: drugsNeedingUpdate });
  } catch (error) {
    console.error('Error in checkForUpdates controller:', error);
    return res.status(500).json({ success: false, message: 'Failed to check for updates.' });
  }
};

const fetchAndApplyUpdates = async (req, res) => {
  try {
    const { updateDrugIds } = req.body;

    if (!updateDrugIds || !Array.isArray(updateDrugIds) || updateDrugIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or empty updateDrugIds array provided.' });
    }

    await DrugService.fetchAndUpdateDrugs(updateDrugIds);

    return res.status(200).json({ success: true, message: 'Drugs updated successfully.' });
  } catch (error) {
    console.error('Error in fetchAndApplyUpdates controller:', error);
    return res.status(500).json({ success: false, message: 'Failed to update drugs.' });
  }
};
const path = require("path");

const uploadDrugImage = async (req, res) => {
  const { DrugID } = req.params;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imagePath = path.join(req.file.filename);

    // Update the drug's ImagesPath
    const updatedDrug = await DrugService.updateDrug(DrugID, { ImagesPath: imagePath });

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imagePath,
      drug: updatedDrug,
    });
  } catch (error) {
    console.error("Error in uploadDrugImage:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

const setPriceUpdateDate = async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    // Set the price update date in the service
    DrugService.setPriceUpdateDate(date);

    res.status(200).json({ message: "Price update date set successfully", date });
  } catch (error) {
    console.error("Error in setPriceUpdateDate:", error);
    res.status(500).json({ error: "Failed to set price update date" });
  }
};

module.exports = {
  searchDrugByATCName,
  searchDrugByName,
  getDrugById,
  filterDrugs,
  addDrug,
  addPharmacyDrug,
  getAllDrugs,
  smartSearch,
  getDrugByATCLevel,
  addDrugATC,
  getDosageByDrugId,
  getDosageByDrugName,
  getRouteByDrugId, 
  getRouteByDrugName,
  getPresentationByDrugId,
  getPresentationByDrugName,
  getStratumByDrugId,
  checkMate,
  getOTCDrugs,
  getDrugByDiseaseCategoryController,
  getDrugSubstitutesController,
  checkDrugNameInAPI,
  deleteDrug,
  updateDrug,
  deleteDosagesByDrugId,
  deletePresentationsByDrugId,
  getAllDrugsPaginated,
  getAllDrugsPaginatedByATC,
  fetchDrugData,
  fetchAndApplyUpdates,
  checkForUpdates,
  uploadDrugImage,
  setPriceUpdateDate,

};
