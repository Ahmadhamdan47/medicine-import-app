// import React, { useState, useEffect } from "react";
// import Axios from "../../../../../api/axios";

// // DrugsSelectionInputs component
// const SelectionInputs = () => {
//   // State variables to store options for each selection input
//   const [atcCodes, setAtcCodes] = useState([]);
//   const [dosageUnits, setDosageUnits] = useState([]);
//   const [presentationUnits, setPresentationUnits] = useState([]);
//   const [presentationTypes, setPresentationTypes] = useState([]);
//   const [forms, setForms] = useState([]);
//   const [routes, setRoutes] = useState([]);
//   const [strata, setStrata] = useState([]);
//   const [stratumTypes, setStratumTypes] = useState([]);
//   const [agents, setAgents] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [manufacturers, setManufacturers] = useState([]);
//   const [countries, setCountries] = useState([]);
//   const [drugLabels, setDrugLabels] = useState([]);

//   //   useEffect(() => {
//   //     const fetchData = async () => {
//   //       try {
//   //         // Fetch data for each endpoint and update state variables
//   //         const endpoints = {
//   //           ATCCodes: setAtcCodes,
//   //           DosageUnit: setDosageUnits,
//   //           PresentationUnit: setPresentationUnits,
//   //           PresentationType: setPresentationTypes,
//   //           drugForms: setForms,
//   //           routes: setRoutes,
//   //           Stratum: setStrata,
//   //           StratumType: setStratumTypes,
//   //           agents: setAgents,
//   //           Brands: setBrands,
//   //           manufacturers: setManufacturers,
//   //           countries: setCountries,
//   //           DrugLabels: setDrugLabels,
//   //         };

//   //         const fetchRequests = Object.keys(endpoints).map(async (key) => {
//   //           const response = await Axios.get(`/api/list/v1.0/${key}`);
//   //           endpoints[key](response.data);
//   //         });

//   //         await Promise.all(fetchRequests);
//   //       } catch (error) {
//   //         console.error("Error fetching data:", error);
//   //       }
//   //     };

//   //     fetchData();

//   //     return () => {
//   //       // Cleanup function if needed
//   //     };
//   //   }, []); // Empty dependency array ensures this effect runs only once when component mounts

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const endpoints = {
//           ATCCodes: setAtcCodes,
//           DosageUnit: setDosageUnits,
//           // Add other endpoints here...
//         };

//         const fetchRequests = Object.keys(endpoints).map(async (key) => {
//           const response = await Axios.get(`/api/list/v1.0/${key}`);
//           if (!response.ok) {
//             throw new Error(`Failed to fetch ${key} data`);
//           }
//           const responseData = await response.json();

//           // Ensure that responseData is an array
//           if (!Array.isArray(responseData)) {
//             throw new Error(`Invalid ${key} data format`);
//           }

//           // Update state with the fetched data
//           endpoints[key](responseData);
//         });

//         await Promise.all(fetchRequests);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         // Optionally, handle the error state or display a message to the user
//       }
//     };

//     fetchData();

//     return () => {
//       // Cleanup function if needed
//     };
//   }, []);

//   console.log("ATC Codes:", atcCodes);
//   return (
//     <div>
//       <select>
//         {atcCodes.map((code) => (
//           <option key={code.value} value={code.value}>
//             {code.name}
//           </option>
//         ))}
//       </select>

//       {/* <select>
//         {dosageUnits.map((unit) => (
//           <option key={unit.value} value={unit.value}>
//             {unit.name}
//           </option>
//         ))}
//       </select>

//       <select>
//         {presentationUnits.map((unit) => (
//           <option key={unit.value} value={unit.value}>
//             {unit.name}
//           </option>
//         ))}
//       </select> */}
//     </div>
//   );
// };

// // Parent component using DrugsSelectionInputs
// const DrugSelections = () => {
//   return (
//     <div>
//       <h2>Select Data Options</h2>
//       <SelectionInputs />
//     </div>
//   );
// };

// export default DrugSelections;

// import React from "react";
// import { useQuery } from "react-query";
// import Axios from "../../../../../api/axios";

// const ATCCodesDropdown = () => {
//   const { data, isLoading, isError } = useQuery("atcCodes", async () => {
//     try {
//       const response = await Axios.get("/api/list/v1.0/ATCCodes");
//       console.log("API Response:", response.data); // Log the data from the API response
//       return response.data; // Return the data from the API response
//     } catch (error) {
//       console.error("Error fetching data:", error); // Log any errors
//       throw new Error("Unable to fetch data");
//     }
//   });
//   console.log("useQuery data:", data); // Log the data obtained from useQuery

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (isError) {
//     return <div>Error fetching data</div>;
//   }

//   if (!data || data.length === 0) {
//     console.log("Data is undefined"); // Log if data is undefined
//     return <div>No data available</div>;
//   }
//   console.log("isLoading:", isLoading); // Log isLoading
//   console.log("isError:", isError); // Log isError
//   return (
//     <div>
//       <label htmlFor="atcCodes">Select an ATC Code:</label>
//       <select id="atcCodes">
//         <option value="">Select ATC Code</option> {/* Add a default option */}
//         {data.map((item) => (
//           <option key={item.value} value={item.value}>
//             {item.name}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default ATCCodesDropdown;
// ////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////

// import React, { useState, useEffect } from "react";
// import Axios from "../../../../../api/axios";

// const ATCsList = ({ onCreateBtnClick }) => {
//   const [atcCodes, setAtcCodes] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const atcResponse = await Axios.get("/api/atc/v1.0");
//         const atcItems = Array.isArray(atcResponse.data)
//           ? atcResponse.data
//           : [];
//         console.log("ATC Items:", atcItems); // Check the structure of atcItems
//         const atcCodeData = await Promise.all(
//           atcItems.map(async (atcItem) => {
//             const atcCodeResponse = await Axios.get(
//               `/api/atccodes/v1.0/codes/${atcItem.guid}`
//             );
//             console.log("ATC Code Response:", atcCodeResponse.data); // Check the structure of atcCodeResponse.data
//             return atcCodeResponse.data;
//           })
//         );
//         setAtcCodes(atcCodeData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div>
//       <select>
//         {atcCodes.map((atcCode) => (
//           <option key={atcCode.code} value={atcCode.code}>
//             {atcCode.name}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default ATCsList;
// ////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////
import { useQuery } from "react-query";
// ////////////////////////////////////////////////////////////
import React, { useState, useEffect } from "react";

import Axios from "../../../../../api/axios";

const ATCsList = () => {
  const {
    data: atcCodes,
    isLoading,
    isError,
  } = useQuery("atcCodes", async () => {
    const atcResponse = await Axios.get("/api/atc/v1.0");
    const filteredData = atcResponse.data.filter(
      (item) => Object.keys(item).length > 0
    );
    const atcCodeData = filteredData.map((atcItem) => ({
      guid: atcItem.guid,
      code: atcItem.code,
      levelName: atcItem.levelName,
      levelNameAr: atcItem.levelNameAr,
    }));
    return atcCodeData;
  });

  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    if (atcCodes && atcCodes.length > 0) {
      setSelectedValue(atcCodes[0]?.code);
    }
  }, [atcCodes]);

  const handleSelectChange = (e) => {
    setSelectedValue(e.target.value);
  };

  return (
    <div className="container mx-auto h-screen p-4 text-black-text dark:text-white-text">
      <h2 className="text-[1.750rem] text-center text-green-pri font-medium">
        Select ATC Code
      </h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error fetching data</div>
      ) : (
        <div>
          <select
            value={selectedValue}
            onChange={handleSelectChange}
            className="w-[6rem] rounded-md py-1 px-3 dark:border-white-text text-black-text dark:text-white-text bg-white-bg dark:bg-black-bg dark:focus:border-transparent outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
          >
            {atcCodes.map((atcCode) => (
              <option key={atcCode.guid} value={atcCode.code}>
                {atcCode.code}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default ATCsList;
