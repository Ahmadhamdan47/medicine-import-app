import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

import dummyResultData from "./dummyResultData";

const Bar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showATCFilters, setShowATCFilters] = useState(false);
  const [showAlphabetFilters, setShowAlphabetFilters] = useState(false);
  const [showOTCFilters, setShowOTCFilters] = useState(false);
  const [selectedClassFilter, setSelectedClassFilter] = useState(null);
  const [selectedAlphabetFilter, setSelectedAlphabetFilter] = useState(null);

  const handleSearch = (query, classFilter) => {
    setSearchQuery(query);

    // Simulate fetching search results (replace with your actual search logic)
    const results = dummySearchFunction(query, classFilter);
    setSearchResults(results);
  };

  const handleATCFilterClick = () => {
    setShowATCFilters(!showATCFilters);
    // Hide alphabet filters when ATC filters are shown
    setShowAlphabetFilters(false);
  };

  
  const handleIconClick = () => {
    // Trigger the search with the current searchQuery and selectedClassFilter
    handleSearch(searchQuery, selectedClassFilter);
  };


  const handleAlphabetFilterClick = (letter) => {
    setSelectedAlphabetFilter((prevFilter) => {
      console.log("prevFilter:", prevFilter);
      console.log("letter:", letter);
      return prevFilter === letter ? null : letter;
    });

    // Filter results based on names starting with the selected letter
    const results = dummyResultData.filter((result) =>
      result.name.toLowerCase().startsWith(letter.toLowerCase())
    );

    setSearchResults(results);
  };

  const handleClassFilterClick = (classFilter) => {
    // Toggle the selected class filter
    setSelectedClassFilter((prevFilter) =>
      prevFilter === classFilter ? null : classFilter
    );

    // Clear search results if the class filter doesn't match the current search query
    if (classFilter && searchQuery) {
      const results = dummySearchFunction(searchQuery, classFilter);
      setSearchResults(results);
    } else {
      // Clear results when the class filter is unchecked
      setSearchResults([]);
    }
  };

  const handleOTCFilterClick = () => {
    // Toggle the OTC filter
    setShowOTCFilters(!showOTCFilters);

    // Fetch all data when the OTC filter is selected
    if (!showOTCFilters) {
      const allResults = dummyResultData; // Replace this with your actual data fetching logic
      setSearchResults(allResults);
    } else {
      // Clear search results when the OTC filter is deselected
      setSearchResults([]);
    }

    // Hide other filters
    setShowATCFilters(false);
    setShowAlphabetFilters(false);
  };

  const dummySearchFunction = (query, classFilter) => dummyResultData.filter((result) => {
      const lowercaseName = result.name.toLowerCase();
      const lowercaseQuery = query.toLowerCase();
      const matchesQuery =
        lowercaseName.includes(lowercaseQuery) &&
        (!classFilter || result.filters.classFilter === classFilter);

      return matchesQuery;
    });

  const clearFilters = () => {
    setSearchQuery("");
    setSearchResults([]); // Clear search results
    setSelectedClassFilter(null);
    setSelectedAlphabetFilter(null);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search for medicines..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value, selectedClassFilter)}
        className="w-full p-2 rounded-2xl border border-white-shadow dark:border-black-border bg-white-contents dark:bg-black-contents px-4 py-2 font-normal dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
      />

      <div className="search-icon cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
        <FaSearch onClick={handleIconClick} />
      </div>
    </div>
  );
};

export default Bar;
{
  /* className="w-full p-2 rounded-full border border-white-shadow dark:border-black-border bg-white-contents dark:bg-black-contents px-4 py-2 font-normal dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
      /> */
}
