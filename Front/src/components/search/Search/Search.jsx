import React, { useState } from "react";

import SearchData from "./SearchData";
import ATCContainer from "./ATCContainer";
import FilterButtons from "./FilterButtons";
import { searchicon } from "../../../images";
import AlphabetButtons from "./AlphabetButtons";
// import './search.css'

function Search(props) {
  const [activeFilter, setActiveFilter] = useState(null);
  const [activeLetterFilter, setActiveLetterFilter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [data, setData] = useState([
    // Manually set data as an array of objects
    {
      id: 1,
      name: "Panadol",
      category: "Category 1",
      dose: "5mg",
      drugName: "Drug A",
      presentation: "Tablet",
      form: "Tablet",
      route: "Oral",
      type: "Brand",
      substituteAvailable: true,
      price: "$10.00",
    },
    {
      id: 2,
      name: "Advil",
      category: "Category 2",
      dose: "10mg",
      drugName: "Drug B",
      presentation: "Capsule",
      form: "Solid",
      route: "Oral",
      type: "Generic",
      substituteAvailable: true,
      price: "$15.00",
    },
    {
      id: 3,
      name: "Risperdal",
      category: "Category 3",
      dose: "10mg",
      drugName: "Drug B",
      presentation: "Capsule",
      form: "Solid",
      route: "Oral",
      type: "Biological Human",
      substituteAvailable: true,
      price: "$15.00",
    },
    {
      id: 4,
      name: "Zoloft",
      category: "Category 4",
      dose: "10mg",
      drugName: "Drug B",
      presentation: "Capsule",
      form: "Solid",
      route: "Oral",
      type: "Biological Similar",
      substituteAvailable: true,
      price: "$15.00",
    },
    // Add more data items here as needed
  ]);
  const [filteredData, setFilteredData] = useState(data);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);

    // Filter the data based on the selected letter or filter type
    if (filter === "A-Z") {
      setFilteredData(data);
    } else if (filter === "ATC") {
      setFilteredData(data);
    } else if (filter === "OTC") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) => item.name.startsWith(filter));
      setFilteredData(filtered);
    }
  };

  const handleLetterFilterClick = (letter) => {
    setActiveLetterFilter(letter);

    // Filter the data based on the selected letter
    const filtered = data.filter((item) => item.name.startsWith(letter));
    setFilteredData(filtered);
  };

  const handleToggleFilters = () => {
    setShowFilters((prevState) => !prevState);
  };

  const handleSearchInputChange = (e) => {
    const searchTerm = e.target.value.trim().toLowerCase();
    if (searchTerm) {
      const filtered = data.filter((item) =>
        item.name.toLowerCase().startsWith(searchTerm)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-2xl mb-4">SearchM</h3>
      <div className="flex items-center mb-4">
        <input
          type="text"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          id="searchInput"
          placeholder="Search"
          onChange={handleSearchInputChange}
        />
        <span className="ml-2">
          <img src={searchicon} alt="search" className="w-6 h-6" />
        </span>
      </div>
      <button
        className={`bg-blue-500 text-white px-4 py-2 rounded-md${
          showFilters === true ? " opacity-50" : ""
        }`}
        onClick={handleToggleFilters}
      >
        Advanced Search
      </button>
      {showFilters && (
        <>
          <FilterButtons
            activeFilter={activeFilter}
            handleFilterClick={handleFilterClick}
          />
          {activeFilter === "A-Z" && (
            <AlphabetButtons
              activeFilter={activeLetterFilter}
              handleFilterClick={handleLetterFilterClick}
            />
          )}
          {activeFilter === "ATC" && <ATCContainer />}
        </>
      )}
      {/* <SearchData filteredData={filteredData} data={data} /> */}
      <SearchData filteredData={filteredData} />
    </div>
  );
}

export default Search;
