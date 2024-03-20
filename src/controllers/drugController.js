// const DrugService = require("../services/drugService");

// const addPharmacyDrug = async (req, res) => {
//   const drugData = req.body;

//   try {
//     const newDrug = await DrugService.addPharmacyDrug(drugData);
//     res.json(newDrug);
//   } catch (error) {
//     res.status(500).json({ error: error.toString() });
//   }
// };
// // Define an asynchronous function named 'addDrug'
// const addDrug = async (req, res) => {
//   // Extract the drug data from the request body
//   const drugData = req.body;

//   try {
//     // Call the 'addDrug' function from the DrugService module, passing the drug data as an argument
//     const newDrug = await DrugService.addDrug(drugData);

//     // Send the new drug in the response
//     res.json(newDrug);
//   } catch (error) {
//     // If an error occurs, send a 500 status code and the error message in the response
//     res.status(500).json({ error: error.toString() });
//   }
// };
// // Define an asynchronous function named 'searchDrugByATCName'
// const searchDrugByATCName = async (req, res) => {
//   // Extract the 'query' parameter from the request
//   const query = req.params.query;

//   try {
//     // Call the 'searchDrugByATCName' function from the DrugService module, passing the 'query' as an argument
//     const result = await DrugService.searchDrugByATCName(query);

//     // Send the result in the response
//     res.json(result);
//   } catch (error) {
//     // If an error occurs, send a 500 status code and an error message in the response
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// // Define an asynchronous function named 'searchDrugByBrandName'
// const searchDrugByBrandName = async (req, res) => {
//   // Extract the 'query' parameter from the request
//   const query = req.params.query;

//   try {
//     // Call the 'searchDrugByBrandName' function from the DrugService module, passing the 'query' as an argument
//     const result = await DrugService.searchDrugByBrandName(query);

//     // Send the result in the response
//     res.json(result);
//   } catch (error) {
//     // If an error occurs, send a 500 status code and an error message in the response
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// // Define an asynchronous function named 'getDrugByGuid'
// const getDrugByGuid = async (req, res) => {
//   try {
//     // Extract the 'guid' parameter from the request
//     const { guid } = req.params;

//     // Call the 'getDrugByGuid' function from the DrugService module, passing the 'guid' as an argument
//     const drug = await DrugService.getDrugByGuid(guid);

//     // If the drug is not found, send a 404 status code and an error message in the response
//     if (!drug) {
//       return res.status(404).json({ error: "Drug not found" });
//     }

//     // Send the drug in the response
//     res.json(drug);
//   } catch (error) {
//     // If an error occurs, send a 500 status code and the error message in the response
//     res.status(500).json({ error: error.toString() });
//   }
// };

// // Define an asynchronous function named 'filterDrugs'
// const filterDrugs = async (req, res) => {
//   // Extract the 'query' parameter from the request
//   const query = req.params.query;

//   try {
//     // Call the 'searchDrugByATCName' function from the DrugService module, passing the 'query' as an argument
//     const searchResults = await DrugService.searchDrugByATCName(query);

//     // Call the 'filterDrugs' function from the DrugService module, passing the search results as an argument
//     const filteredResults = await DrugService.filterDrugs(searchResults);

//     // Send the filtered results in the response
//     res.json(filteredResults);
//   } catch (error) {
//     // If an error occurs, send a 500 status code and an error message in the response
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// const getAllDrugs = async (req, res, next) => {
//   try {
//     const drugs = await drugService.getAllDrugs();
//     res.status(200).json(drugs);
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = {
//   searchDrugByATCName,
//   searchDrugByBrandName,
//   getDrugByGuid,
//   filterDrugs,
//   addDrug,
//   addPharmacyDrug,
//   getAllDrugs,
// };
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

const searchDrugByBrandName = async (req, res) => {
  const query = req.params.query;

  try {
    const result = await DrugService.searchDrugByBrandName(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getDrugByGuid = async (req, res) => {
  try {
    const { guid } = req.params;
    const drug = await DrugService.getDrugByGuid(guid);

    if (!drug) {
      return res.status(404).json({ error: "Drug not found" });
    }

    res.json(drug);
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

module.exports = {
  searchDrugByATCName,
  searchDrugByBrandName,
  getDrugByGuid,
  filterDrugs,
  addDrug,
  addPharmacyDrug,
  getAllDrugs,
};
