import axios from "axios";
import React, { useState } from "react";

const DrugSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const searchByATCName = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/drugs/search/atc/${query}`
      );
      return response.data;
    } catch (error) {
      console.error("Error searching drugs by ATC name:", error);
      return []; // Return an empty array in case of an error
    }
  };

  const searchByBrandName = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/drugs/search/brand/${query}`
      );
      return response.data;
    } catch (error) {
      console.error("Error searching drugs by Brand name:", error);
      return []; // Return an empty array in case of an error
    }
  };

  const handleSearch = async () => {
    try {
      const atcResults = await searchByATCName();
      const brandResults = await searchByBrandName();
      const combinedResults = [...atcResults, ...brandResults];
      setResults(combinedResults);
    } catch (error) {
      console.error("Error searching drugs:", error);
      setResults([]); // Set results to an empty array in case of an error
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
      <button onClick={handleSearch}>Search</button>
      <ul>
        {results && results.length > 0 ? (
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
