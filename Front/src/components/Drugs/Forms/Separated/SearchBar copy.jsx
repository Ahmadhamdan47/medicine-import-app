// import React, { useState } from "react";
// import Axios from "../../../../api/axios";

// const DrugSearch = () => {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);

//   const handleSearch = async () => {
//     try {
//       // Call search function with the query parameter
//       const response = await Axios.get(`/drugs/search/${query}`);

//       // Update results state with the search results
//       setResults(response.data);
//     } catch (error) {
//       console.error("Error searching drugs:", error);
//     }
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder="Enter search query"
//       />
//       <button onClick={handleSearch} disabled={!query.trim()}>
//         Search
//       </button>
//       <ul>
//         {results && results.length > 0 ? (
//           results.map((drug, index) => (
//             <li key={index}>
//               <p>Brand Name: {drug.BrandName}</p>
//               <p>ATC Name: {drug.ATCName}</p>
//               <p>Price USD: {drug.PriceUSD}</p>
//               <p>Price LBP: {drug.PriceLBP}</p>
//               <p>Dosage Name: {drug.DosageName}</p>
//               <p>Presentation Name: {drug.PresentationName}</p>
//               <p>Form Name: {drug.FormName}</p>
//               <p>Route Name: {drug.RouteName}</p>
//               <p>Stratum Type Name: {drug.StratumTypeName}</p>
//               <p>Country Name: {drug.CountryName}</p>
//               <p>Manufacturer Name: {drug.ManufacturerName}</p>
//               <p>Image Default: {drug.ImageDefault}</p>
//             </li>
//           ))
//         ) : (
//           <li>No results found</li>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default DrugSearch;

/// ///////////////////////////////////////////
/// ///////////////////////////////////////////
/// ///////////////////////////////////////////
/// ///////////////////////////////////////////

// import React, { useState } from "react";
// import Axios from "../../../../api/axios";

// const DrugSearch = () => {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [searched, setSearched] = useState(false); // State to track if search button is clicked

//   const handleSearch = async () => {
//     try {
//       // Call search function with the query parameter
//       const response = await Axios.get(`/drugs/search/${query}`);

//       // Update results state with the search results
//       setResults(response.data);
//       setSearched(true); // Set searched to true after search button is clicked
//     } catch (error) {
//       console.error("Error searching drugs:", error);
//     }
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder="Enter search query"
//       />
//       <button onClick={handleSearch} disabled={!query.trim()}>
//         Search
//       </button>
//       <ul>
//         {searched && results && results.length > 0 ? (
//           results
//             .filter((drug) => drug.ATCName) // Filter out results with empty ATC code
//             .map((drug, index) => (
//               <li key={index}>
//                 <p>Brand Name: {drug.BrandName}</p>
//                 <p>ATC Name: {drug.ATCName}</p>
//                 <p>Price USD: {drug.PriceUSD}</p>
//                 <p>Price LBP: {drug.PriceLBP}</p>
//                 <p>Dosage Name: {drug.DosageName}</p>
//                 <p>Presentation Name: {drug.PresentationName}</p>
//                 <p>Form Name: {drug.FormName}</p>
//                 <p>Route Name: {drug.RouteName}</p>
//                 <p>Stratum Type Name: {drug.StratumTypeName}</p>
//                 <p>Country Name: {drug.CountryName}</p>
//                 <p>Manufacturer Name: {drug.ManufacturerName}</p>
//                 <p>Image Default: {drug.ImageDefault}</p>
//               </li>
//             ))
//         ) : (
//           <li>{searched ? "No results found" : "Please search for a drug"}</li>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default DrugSearch;

// ////////////////////////////
// ////////////////////////////
// ////////////////////////////
// ////////////////////////////

// import React, { useState } from "react";
// import Axios from "../../../../api/axios";

// const DrugSearch = () => {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [error, setError] = useState(null); // New state for error handling

//   const handleSearch = async () => {
//     try {
//       const response = await Axios.get(`/drugs/search/${query}`);
//       console.log("Response:", response); // Log the entire response object
//       console.log("Response data type:", typeof response.data); // Log the type of response data

//       // Log the response data itself
//       console.log("Response data:", response.data);

//       // Check if the response is successful
//       if (Array.isArray(response.data) && response.data.length > 0) {
//         setResults(response.data);
//         setError(null);
//       } else {
//         setResults([]); // Clear results state
//         setError("No results found"); // Set error message
//       }
//     } catch (error) {
//       console.error("Error searching drugs:", error);
//       setError("Error searching drugs. Please try again."); // Set error message
//       console.error("Invalid response data:", response.data);
//       // Handle invalid response data or empty array
//       console.error("Error searching drugs:", error);
//       // Handle error
//     }
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder="Enter search query"
//       />
//       <button onClick={handleSearch} disabled={!query.trim()}>
//         Search
//       </button>
//       <ul>
//         {error ? (
//           <li>{error}</li>
//         ) : results && results.length > 0 ? (
//           results.map((drug, index) => (
//             <li key={index}>
//               <p>Brand Name: {drug.BrandName}</p>
//               <p>ATC Name: {drug.ATCName}</p>
//               <p>Price USD: {drug.PriceUSD}</p>
//               <p>Price LBP: {drug.PriceLBP}</p>
//               <p>Dosage Name: {drug.DosageName}</p>
//               <p>Presentation Name: {drug.PresentationName}</p>
//               <p>Form Name: {drug.FormName}</p>
//               <p>Route Name: {drug.RouteName}</p>
//               <p>Stratum Type Name: {drug.StratumTypeName}</p>
//               <p>Country Name: {drug.CountryName}</p>
//               <p>Manufacturer Name: {drug.ManufacturerName}</p>
//               <p>Image Default: {drug.ImageDefault}</p>
//             </li>
//           ))
//         ) : (
//           <li>No results found</li>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default DrugSearch;

// ////////////////////////////
// ////////////////////////////
// ////////////////////////////
// ////////////////////////////
// ////////////////////////////

// import Axios from "../../../../api/axios";
import axios from "axios";
import React, { useState } from "react";

const DrugSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/drugs/search/${query}`);

      console.log("Response:", response); // Log the entire response object

      const responseData = response.data;
      console.log("Response data:", responseData); // Log the response data itself

      // Check if response data is an array
      if (Array.isArray(responseData) && responseData.length > 0) {
        // Update results state with the search results
        setResults(responseData);
        setError(null);
      } else {
        console.error("Invalid response data:", responseData);
        // Handle invalid response data or empty array
        setResults([]);
        setError("No results found");
      }
    } catch (error) {
      console.error("Error searching drugs:", error);
      setError("Error searching drugs. Please try again.");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter search query"
      />
      <button onClick={handleSearch} disabled={!query.trim()}>
        Search
      </button>
      <ul>
        {error ? (
          <li>{error}</li>
        ) : results && results.length > 0 ? (
          results.map((drug, index) => (
            <li key={index}>
              <p>Brand Name: {drug.BrandName}</p>
              <p>ATC Name: {drug.ATCName}</p>
              <p>Price USD: {drug.PriceUSD}</p>
              <p>Price LBP: {drug.PriceLBP}</p>
              <p>Dosage Name: {drug.DosageName}</p>
              <p>Presentation Name: {drug.PresentationName}</p>
              <p>Form Name: {drug.FormName}</p>
              <p>Route Name: {drug.RouteName}</p>
              <p>Stratum Type Name: {drug.StratumTypeName}</p>
              <p>Country Name: {drug.CountryName}</p>
              <p>Manufacturer Name: {drug.ManufacturerName}</p>
              <p>Image Default: {drug.ImageDefault}</p>
            </li>
          ))
        ) : (
          <li>No results found</li>
        )}
      </ul>
    </div>
  );
};

export default DrugSearch;
