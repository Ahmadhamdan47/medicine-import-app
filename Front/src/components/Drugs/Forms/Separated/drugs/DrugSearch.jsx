import React, { useState } from 'react';

import {
  useSearchDrugByATCNameQuery,
  useSearchDrugByBrandNameQuery,
} from '../../../../../app/slices/apiSlice';

const DrugSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  // Use the generated query hooks within the component function body
  const { data: atcDrugs, error: atcError } = useSearchDrugByATCNameQuery(query);
  const { data: brandDrugs, error: brandError } = useSearchDrugByBrandNameQuery(query);

  const handleSearchATC = () => {
    // Reset previous error state
    setError(null);

    if (query.trim() !== '') {
      // Set results to ATC drugs data
      setResults(atcDrugs || []);
    } else {
      setError('Please enter a valid ATC name.');
      setResults([]);
    }
  };

  const handleSearchBrand = () => {
    // Reset previous error state
    setError(null);

    if (query.trim() !== '') {
      // Set results to Brand drugs data
      setResults(brandDrugs || []);
    } else {
      setError('Please enter a valid brand name.');
      setResults([]);
    }
  };

  return (
    <div className="w-full mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:border-blue-400"
          placeholder="Enter drug name"
        />

        <div className="flex justify-center">
          <button onClick={handleSearchATC} className="mr-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded focus:outline-none focus:shadow-outline">
            Search by ATC Name
          </button>

          <button onClick={handleSearchBrand} className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded focus:outline-none focus:shadow-outline">
            Search by Brand Name
          </button>
        </div>

        {/* Display any errors */}
        {error && <div className="text-red-500 mt-2">{error}</div>}

        <ul className="mt-4">
          {/* Display search results */}
          {results.map((drug, index) => (
            <li key={index} className="border-b border-gray-300 py-2">
              <span className="font-semibold">Brand Name:</span> {drug.BrandName}<br />
              <span className="font-semibold">ATC Name:</span> {drug.ATCName}<br />
              <span className="font-semibold">Country Name:</span> {drug.CountryName}<br />
              <span className="font-semibold">Dosage Name:</span> {drug.DosageName}<br />
              <span className="font-semibold">Form Name:</span> {drug.FormName}<br />
              <span className="font-semibold">Manufacturer Name:</span> {drug.ManufacturerName}<br />
              <span className="font-semibold">Presentation Name:</span> {drug.PresentationName}<br />
              <span className="font-semibold">Price LBP:</span> {drug.PriceLBP}<br />
              <span className="font-semibold">Price USD:</span> {drug.PriceUSD}<br />
              <span className="font-semibold">Route Name:</span> {drug.RouteName}<br />
              <span className="font-semibold">Stratum Type Name:</span> {drug.StratumTypeName}<br />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DrugSearch;
