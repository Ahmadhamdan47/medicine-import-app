/*
DESECLECT ABILITY:

import React from "react";

function FilterButtons({ activeFilter, handleFilterClick }) {
  const handleClick = (filter) => {
    // Toggle the active state of the filter
    if (activeFilter === filter) {
      handleFilterClick(null); // Deselect the filter
    } else {
      handleFilterClick(filter); // Select the filter
    }
  };

  return (
    <div className="filters w-full flex justify-center py-4">
      <div className="filters w-fit bg-green-pri flex justify-center gap-2 p-2 rounded-xl">
        <button
          className={`filters-btn ${
            activeFilter === "A-Z"
              ? "active bg-white-bg rounded-full py-2 px-3"
              : "rounded-full py-2 px-3"
          }`}
          onClick={() => handleClick("A-Z")}
        >
          A-Z
        </button>
        <button
          className={`filters-btn ${
            activeFilter === "ATC"
              ? "active bg-white-bg rounded-full py-2 px-3"
              : "rounded-full py-2 px-3"
          }`}
          onClick={() => handleClick("ATC")}
        >
          ATC
        </button>
        <button
          className={`filters-btn ${
            activeFilter === "OTC"
              ? "active bg-white-bg rounded-full py-2 px-3"
              : "rounded-full py-2 px-3"
          }`}
          onClick={() => handleClick("OTC")}
        >
          OTC
        </button>
      </div>
    </div>
  );
}

export default FilterButtons;


// */ /// ////////////////////////////////////////////////////////////////////////////////////////

import React from "react";

function FilterButtons({ activeFilter, handleFilterClick }) {
  return (
    <div className="filters w-full flex justify-center py-4">
      <div className="filters w-fit bg-green-pri flex justify-center gap-2 p-2 rounded-xl">
        <button
          className={`filters-btn ${
            activeFilter === "A-Z"
              ? "active bg-white-bg rounded-full py-2 px-3"
              : "rounded-full py-2 px-3"
          }`}
          onClick={() => handleFilterClick("A-Z")}
        >
          A-Z
        </button>
        <button
          className={`filters-btn ${
            activeFilter === "ATC"
              ? "active bg-white-bg rounded-full py-2 px-3"
              : "rounded-full py-2 px-3"
          }`}
          onClick={() => handleFilterClick("ATC")}
        >
          ATC
        </button>
        <button
          className={`filters-btn ${
            activeFilter === "OTC"
              ? "active bg-white-bg rounded-full py-2 px-3"
              : "rounded-full py-2 px-3"
          }`}
          onClick={() => handleFilterClick("OTC")}
        >
          OTC
        </button>
      </div>
    </div>
  );
}

export default FilterButtons;