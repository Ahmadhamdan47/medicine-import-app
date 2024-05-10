 
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
// /* eslint-disable no-shadow */
// /* eslint-disable react/prop-types */
// /* eslint-disable react/jsx-no-constructed-context-values */
import React, { useState, useContext, createContext } from 'react';
import axios from 'axios';

// Simulated backend functions
const searchDrugByATCName = async (atcName) =>
  // Simulate API call to search drugs by ATC name
  // This function should return an array of drug objects
  new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulated data
      const drugs = [
        { DrugID: 1, BrandName: 'Drug 1', PriceForeign: 10.99 },
        { DrugID: 2, BrandName: 'Drug 2', PriceForeign: 20.49 },
      ];
      resolve(drugs);
    }, 1000); // Simulated delay of 1 second
  });

const searchDrugByName = async (query) => {
  try {
    // Make a GET request to the endpoint with the query parameter
    const response = await axios.get(`http://localhost:9000/drugs/smartSearch?query=${query}`);

    // Extract the data from the response
    const drugs = response.data;

    // Return the array of drug objects
    return drugs;
  } catch (error) {
    // Handle any errors that occur during the request
    console.error('Error fetching drugs:', error);
    throw new Error('Failed to fetch drugs');
  }
};

// Create a new context
const DrugSearchContext = createContext();

// Custom hook to use the drug context
export const useDrugSearchContext = () => useContext(DrugSearchContext);

// Provider component to manage drug-related state and actions
export const DrugSearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  // Function to handle drug search by name or ATC name
  const handleSearch = async (query) => {
    setError(null);

    try {
      let results;

      // Check if query starts with '@' to determine search type
      if (query.startsWith('@')) {
        const atcName = query.slice(1); // Remove '@' prefix
        results = await searchDrugByATCName(atcName);
      } else {
        results = await searchDrugByName(query);
      }

      setSearchResults(results);
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to handle filtering of drugs
  const handleFilter = () => {
    // Simulated filtering logic
    setSearchResults((prevResults) =>
      [...prevResults].sort((a, b) => a.BrandName.localeCompare(b.BrandName))
    );
  };

  // Function to handle getting drug details by ID
  const handleGetDrugDetails = async (drugId) =>
    // Simulated API call to get drug details by ID
    // This function should return a single drug object
    new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulated data
        const drug = searchResults.find((d) => d.DrugID === drugId);
        resolve(drug);
      }, 500); // Simulated delay of 0.5 second
    });
  return (
    <DrugSearchContext.Provider
      value={{ searchResults, error, handleSearch, handleFilter, handleGetDrugDetails }}
    >
      {children}
    </DrugSearchContext.Provider>
  );
};

// /////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////

// import algoliasearch from 'algoliasearch/lite';
// import React, { useState, useContext, createContext } from 'react';

// const algoliaClient = algoliasearch('NJNWKAS1XM', '9dca555e52ebfb0bfc386724da13903f');
// const index = algoliaClient.initIndex('test_Drugs');

// // Create a new context
// const DrugSearchContext = createContext();

// // Custom hook to use the drug context
// export const useDrugSearchContext = () => useContext(DrugSearchContext);

// // Provider component to manage drug-related state and actions
// export const DrugSearchProvider = ({ children }) => {
//   const [searchResults, setSearchResults] = useState([]);
//   const [error, setError] = useState(null);

//   // Function to handle drug search by name or ATC name
//   const handleSearch = async (query) => {
//     setError(null);

//     try {
//       const { hits } = await index.search(query);
//       setSearchResults(hits);
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   // Function to handle filtering of drugs
//   const handleFilter = () => {
//     // Implement filtering logic here if needed
//   };

//   // Function to handle getting drug details by ID
//   const handleGetDrugDetails = async (drugId) => {
//     try {
//       const { hits } = await index.getObject(drugId);
//       return hits;
//     } catch (error) {
//       setError(error.message);
//       throw new Error(`Failed to fetch drug details: ${error.message}`);
//     }
//   };

//   return (
//     <DrugSearchContext.Provider
//       value={{
//         searchResults,
//         error,
//         handleSearch,
//         handleFilter,
//         handleGetDrugDetails,
//         algoliaClient,
//       }}
//     >
//       {children}
//     </DrugSearchContext.Provider>
//   );
// };
