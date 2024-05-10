import axios from "axios";
import React, {
  useState,
  useEffect,
} from "react";

// import singleDrugRef from "../drugs/list/SingleDrug";


export const Search = () => {
  const {
    selectedDrugGuid,
    setSelectedDrugGuid,
    selectedDrug,
    selectDrug,
    clearSelectedDrug,
  } = useState();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showATCFilters, setShowATCFilters] = useState(false);
  const [showAlphabetFilters, setShowAlphabetFilters] = useState(false);
  const [showOTCFilters, setShowOTCFilters] = useState(false);
  const [selectedClassFilter, setSelectedClassFilter] = useState(null);
  const [selectedAlphabetFilter, setSelectedAlphabetFilter] = useState(null);

  // const [selectedDrugGuid, setSelectedDrugGuid] = useState(null);

  const handleCardClick = (guid) => {
    console.log("Card clicked with guid:", guid);
    setSelectedDrugGuid(guid);
    // Update the ref with the guid associated with the clicked card
    singleDrugRef.current = guid;
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        if (query.trim() === "") {
          setResults([]);
          return;
        }

        const atcResults = await searchByATCName();
        const brandResults = await searchByBrandName();
        const combinedResults = [...atcResults, ...brandResults];
        setResults(combinedResults);
      } catch (error) {
        console.error("Error searching drugs:", error);
      }
    };

    fetchData();

    return () => {
      // Cleanup function if needed
    };
  }, [query]);

  const searchByATCName = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8066/drugs/search/atc/${query}`
      );
      return response.data;
    } catch (error) {
      console.error("Error searching drugs by ATC name:", error);
      throw error;
    }
  };

  const searchByBrandName = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8066/drugs/search/DrugName/${query}`
      );
      return response.data;
    } catch (error) {
      console.error("Error searching drugs by Brand name:", error);
      throw error;
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
    }
  };

  const handleATCFilterClick = () => {
    setShowATCFilters(!showATCFilters);
    // Hide alphabet filters when ATC filters are shown
    setShowAlphabetFilters(false);
  };

  const handleAlphabetFilterClick = async (letter) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/drugs/search/DrugName/${letter}`
      );
      const filteredResults = response.data;
      setResults(filteredResults);
    } catch (error) {
      console.error("Error filtering drugs by alphabet:", error);
    }
  };

  const handleClassFilterClick = (classFilter) => {
    // Toggle the selected class filter
    setSelectedClassFilter((prevFilter) =>
      prevFilter === classFilter ? null : classFilter
    );

    // Clear search results if the class filter doesn't match the current search query
    if (classFilter && query) {
      setResults(results);
    } else {
      // Clear results when the class filter is unchecked
      setResults([]);
    }
  };

  const handleOTCFilterClick = () => {
    // Toggle the OTC filter
    setShowOTCFilters(!showOTCFilters);

    // Fetch all data when the OTC filter is selected
    if (!showOTCFilters) {
      const allResults = results; // Replace this with your actual data fetching logic
      setResults(allResults);
    } else {
      // Clear search results when the OTC filter is deselected
      setResults([]);
    }

    // Hide other filters
    setShowATCFilters(false);
    setShowAlphabetFilters(false);
  };

  const clearFilters = () => {
    setQuery("");
    setResults([]); // Clear search results
    setSelectedClassFilter(null);
    setSelectedAlphabetFilter(null);
  };

  return (
    <div className="container flex flex-col items-center mx-auto p-4">
      <input
        type="text"
        placeholder="Search for medicines..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full sm:w-[50%] p-2 rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
      />
      {/* <button onClick={handleSearch}>Search</button> */}
      <div className="filter-btns-cont flex items-center p-1 mb-4 mt-4 bg-green-pri dark:text-white-bg rounded-lg ">
        <button
          onClick={handleATCFilterClick}
          className={`${
            showATCFilters ? "bg-white-bg text-green-pri" : "text-white-bg "
          } rounded-full px-4 py-2 hover:transition-all duration-200 `}
        >
          {showATCFilters ? "ATC" : "ATC"}
        </button>

        <button
          onClick={() => setShowAlphabetFilters(!showAlphabetFilters)}
          className={`${
            showAlphabetFilters
              ? "bg-white-bg text-green-pri"
              : "text-white-bg "
          } rounded-full px-4 py-2 hover:transition-all duration-200 `}
        >
          {showAlphabetFilters ? "A-to-Z" : "A-to-Z"}
        </button>

        <button
          onClick={handleOTCFilterClick}
          className={`${
            showOTCFilters ? "bg-white-bg text-green-pri" : "text-white-bg "
          } rounded-full px-4 py-2 hover:transition-all duration-200 `}
        >
          {showOTCFilters ? "OTC" : "OTC"}
        </button>
      </div>
      {showATCFilters && (
        <div className="mt-4">
          <div className="flex flex-col justify-center items-center">
            <h3 className="text-lg text-center w-fit text-[#000] dark:text-[#fff] mb-2 rounded px-2">
              Filter by ATC Classes
            </h3>
            <div className="flex justify-center flex-wrap space-x-2">
              {[
                "ClassA",
                "ClassB",
                "ClassC",
                "ClassD",
                "ClassN",
                "ClassG",
                "ClassL",
              ].map((classFilter) => (
                <button
                  key={classFilter}
                  onClick={() => handleClassFilterClick(classFilter)}
                  className={`bg-white-input dark:bg-black-input p-2 rounded-md focus:bg-green-pri ${
                    selectedClassFilter === classFilter
                      ? "bg-white-contents text-white-bg"
                      : "bg-white-contents text-white-bg"
                  }`}
                >
                  {classFilter}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAlphabetFilters && (
        <div className="mt-4">
          <div>
            <h3 className="text-lg text-green-pri mb-2">Filter by Alphabet</h3>
            <div className="flex justify-center flex-wrap space-x-2">
              {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
                <button
                  key={letter}
                  onClick={() => {
                    handleAlphabetFilterClick(letter);
                    console.log(
                      "selectedAlphabetFilter:",
                      selectedAlphabetFilter
                    );
                    console.log("letter:", letter);
                  }}
                  className={`border border-green-pri dark:bg-transparent mb-2 p-[3px] px-3 rounded-full focus:bg-green-pri dark:focus:bg-green-pri ${
                    selectedAlphabetFilter === letter
                      ? "bg-green-pri text-white-bg"
                      : "bg-black-input text-white-bg"
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cards Component Rendering */}
      <div className="mt-8 w-full">
        <h2 className="text-xl mb-2">Medications List</h2>
        <div className="grid grid-cols-1 gap-14 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 py-10 px-2">
          {results.map((result, index) => (
            <div
              key={`card-${index}`} // Example of using index as a unique identifier
              onClick={() => handleCardClick(result.Guid)}
              className={`card w-full overflow-hidden cursor-pointer bg-white-fg dark:bg-black-input rounded-3xl border-2 border-[#00a651] outline-none hover:border-green-pri hover:outline-none hover:ring-2 hover:ring-green-pri dark:hover:ring-2 dark:hover:ring-green-pri p- shadow-xl transition duration-300 hover:scale-105 hover:shadow-2xl dark:text-white-text dark:shadow-lg dark:shadow-[#24382ab0] ${
                result.Guid === selectedDrugGuid ? "clicked" : ""
              }`}
            >
              <div className="flex">
                <div className="flex w-2/5 flex-col" />

                <div className="w-3/5 p-4 text-left">
                  <h2 className="mb-2 text-2xl font-semibold">
                    {result.BrandName}
                  </h2>
                  <p className="mb-2 text-sm italic text-gray-600 dark:text-gray-400">
                    ATC Name: {result.ATCName || "N/A"}
                    <br />
                    Price USD: {result.PriceUSD || "N/A"}
                    <br />
                    Price LBP: {result.PriceLBP || "N/A"}
                    <br />
                    Dosage Name: {result.DosageName || "N/A"}
                    <br />
                    Presentation Name: {result.PresentationName || "N/A"}
                    <br />
                    Form Name: {result.FormName || "N/A"}
                    <br />
                    Route Name: {result.RouteName || "N/A"}
                    <br />
                    Stratum Type Name: {result.StratumTypeName || "N/A"}
                    <br />
                    Country Name: {result.CountryName || "N/A"}
                    <br />
                    Manufacturer Name: {result.ManufacturerName || "N/A"}
                    <br />
                    Image Default: {result.ImageDefault || "N/A"}
                    <br />
                  </p>
                  {/* Add any other necessary components or data display here */}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Conditionally render SingleDrug component when a card is clicked */}
        {selectedDrugGuid && (
          <SingleDrug guid={selectedDrugGuid} className="single-drug-grid" />
        )}
      </div>

      {/* Clear filters button */}
      {(query || selectedClassFilter || selectedAlphabetFilter) && (
        <button
          onClick={clearFilters}
          className="mt-4 bg-red-500 text-white p-2 rounded"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};


// //////////////
// //////////////
// //////////////
// //////////////
