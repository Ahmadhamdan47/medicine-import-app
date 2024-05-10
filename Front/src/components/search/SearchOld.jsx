import Box from "@material-ui/core/Box";
import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import { withStyles, makeStyles } from "@material-ui/core/styles";

import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import InputBase from "@mui/material/InputBase";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ViewListIcon from "@mui/icons-material/ViewList";
import useMediaQuery from "@mui/material/useMediaQuery";
import ViewModuleIcon from "@mui/icons-material/ViewModule";

import "../../index.css";
import { useDarkMode } from "../../DarkModeContext";

const WhiteOutlinedTextField = withStyles({
  root: {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "#00a651",
      borderRadius: "50px",
    },
    "& .MuiOutlinedInput-input": {
      color: "#fff",
      fontFamily: "BebasNeue-Regular", // Set the font family here
    },
  },
})(TextField);

const useStyles = makeStyles((theme) => ({
  customInput: {
    "&:focus": {
      outline: "none",
    },
  },

  paper: {
    fontFamily: "BebasNeue-Regular",
    backgroundColor: "#e5e7eb",
    p: "2px 4px",
    display: "flex",
    alignItems: "center",
    borderRadius: 30,
    transition: "box-shadow 0.3s ease-in-out", // Add transition for a smoother effect
    // boxShadow: "0 0 0 0 transparent", // Initial box-shadow style
    "&:focus-within": {
      outline: "none",
      boxShadow: "0 0 0 3px rgba(37, 159, 131, 0.8)", // Box-shadow on focus
    },
  },

  focusedInput: {
    border: "1px solid #00a651",
  },

  outlinedButton: {
    transition: "background-color 0.3s, color 0.3s, border 0.3s",
    padding: "12px",
    borderRadius: "50px",
    backgroundColor: "transparent",
    color: "#fff",
    // border: "1px solid transparent",
    "&:hover": {
      // backgroundColor: "#00a651",
      // color: "#fff",
      // border: "1px solid #00a651",
      transition: "background-color 0.3s, color 0.3s, border 0.3s",
    },
  },

  outlinedButton2: {
    transition: "background-color 0.3s, color 0.3s, border 0.3s",
    padding: "12px",
    borderRadius: "50px",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "transparent",
      transition: "background-color 0.3s, color 0.3s, border 0.3s",
    },
  },

  activeButton1: {
    backgroundColor: "#fff",
    color: "#00a651",
    // border: "1px solid #00a651",
    transition: "background-color 0.3s, color 0.3s, border 0.3s",
    // "&:hover": {
    //   backgroundColor: "#fff",
    //   color: "#00a651",
    // },
  },

  iconButton: {
    color: "#00a651",
    "&:hover": {
      backgroundColor: "transparent",
      transition: "background-color 0.3s, color 0.3s, border 0.3s",
    },
  },

  activeButton2: {
    backgroundColor: "transparent",
    color: "#00a651",
    "&:hover": {
      backgroundColor: "transparent",
      color: "#00a651",
      transition: "background-color 0.3s, color 0.3s, border 0.3s",
    },
    "&:active": {
      backgroundColor: "transparent",
      color: "#00a651",
    },
  },

  // Add a dark mode variant for the button
  darkActiveButton2: {
    backgroundColor: "transparent",
    color: "#00a651",
    "&:hover": {
      backgroundColor: "transparent",
      color: "#00a651",
    },
    "&:active": {
      backgroundColor: "transparent",
      color: "#00a651",
    },
  },

  activeButton3: {
    transition: "background-color 0.3s, color 0.3s, border 0.3s",
    backgroundColor: "#00a651",
    // color: "#000",
    border: "1px solid #00a651",
  },

  searchIcon: {
    color: "#00a651",
    "&:hover": {
      color: "#17d3a8",
    },
  },
  // Update existing styles for responsiveness
  responsiveContainer: {
    width: "100%",
    padding: theme.spacing(0),
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

// ///////////////////////////////////////////////////////////////////////////

const dummyResultData = [
  { name: "Biafine", class: "ClassB" },
  { name: "Caltrade", class: "ClassC" },
  { name: "Daktacort", class: "ClassD" },
  { name: "Eprima", class: "ClassE" },
  { name: "Gastrazole", class: "ClassG" },
  { name: "Lexotanile", class: "ClassL" },
  { name: "Panadol", class: "ClassB" },
];

const SearchComponent = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();

  const { isDarkMode } = useDarkMode();
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Corrected from setFilter to setSearchQuery
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [activeGroups, setActiveGroups] = useState([]);
  const [isGridView, setIsGridView] = useState(true);
  const [isRowView, setIsRowView] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const backgroundColorClass = isDarkMode ? "#696969" : "#fbfcf8";
  const textColorClass = isDarkMode ? "#fff" : "#000";

  useEffect(() => {
    // Simulate fetching search results based on the applied filters and search query
    const filteredResults = dummyResultData.filter((medication) => {
      const lowercaseMedicationName = medication.name.toLowerCase();
      const lowercaseSearchQuery = searchQuery.toLowerCase();

      const matchesSearch =
        lowercaseSearchQuery === "" ||
        lowercaseMedicationName.includes(lowercaseSearchQuery);

      const matchesLetterFilter =
        selectedFilters.length === 0 ||
        selectedFilters.some((filter) =>
          lowercaseMedicationName.startsWith(filter.toLowerCase())
        );

      const matchesClassFilter =
        activeGroups.length === 0 || activeGroups.includes(medication.class);
      // activeGroups.includes(medication.filterClass);

      return matchesSearch && matchesLetterFilter && matchesClassFilter;
    });

    setSearchResults(filteredResults);
  }, [activeGroups, searchQuery, selectedFilters]);

  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const handleFilterClick = (letter) => {
    setSelectedFilters((prevSelectedFilters) => {
      // Toggle the selected state for the letter
      const updatedFilters = [...prevSelectedFilters];
      const index = updatedFilters.indexOf(letter);

      if (index !== -1) {
        updatedFilters.splice(index, 1);
      } else {
        updatedFilters.push(letter);
      }

      return updatedFilters;
    });
  };

  const [showAlphabetButtons, setShowAlphabetButtons] = useState(false);
  const [showGroupButtons, setShowGroupButtons] = useState(false);

  const handleGroupButtonClick = (action) => {
    // Toggle the visibility of alphabet buttons
    if (action === "A-to-Z") {
      setShowAlphabetButtons((prev) => !prev);
      setShowGroupButtons(false);
    }
    // Toggle the visibility of group buttons
    else if (action === "ATC") {
      setShowGroupButtons((prev) => !prev);
      setShowAlphabetButtons(false);
    } else if (action.startsWith("Class")) {
      // For Class buttons, just toggle the active state without hiding them
      setActiveGroups((prevActiveGroups) => {
        if (prevActiveGroups.includes(action)) {
          return prevActiveGroups.filter((group) => group !== action);
        } 
          return [...prevActiveGroups, action];
        
      });
    } else {
      // Handle other group buttons for filtering
      setShowAlphabetButtons(false);
      setShowGroupButtons(false);
      setActiveGroups((prevActiveGroups) => {
        if (prevActiveGroups.includes(action)) {
          // If already active, remove it
          return prevActiveGroups.filter((group) => group !== action);
        } 
          // If not active, add it
          return [...prevActiveGroups, action];
        
      });
    }
  };

  const handleToggleView = () => {
    setIsGridView((prev) => !prev);
    setIsRowView((prev) => !prev);
  };

  // const handleFilterChange = (value) => {
  //   setSearchValue(value);
  //   setSearchQuery(value);
  // };

  const handleFilterChange = (value) => {
    setSearchValue(value);
    setSearchQuery(value.toLowerCase()); // Convert to lowercase for case-insensitive search
  };

  const handleReset = () => {
    setSearchQuery(""); // Reset the search input
    setSelectedFilters([]); // Reset the selected filters
    setActiveGroups([]); // Reset the active groups
  };

  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    // Your logic for handling form submission
  };

  return (
    <div id="search-main" className="search-main">
      <Box
        className={classes.responsiveContainer}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        fontFamily="BebasNeue-Regular"
        height="auto"
        // bgcolor="#333"
        p={4}
        border="1p"
        paddingTop={0}
      >
        <div className="flex w-full justify-center">
          <Paper
            component="form"
            className={`${classes.paper} ${isFocused ? "focused" : ""}`}
            style={{
              width: isMobile ? "100%" : 600,
              backgroundColor: backgroundColorClass,
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            <InputBase
              style={{
                flexGrow: 1,
                color: textColorClass,
                fontFamily: "BebasNeue-Regular",
              }}
              sx={{
                ml: 1,
                flex: 1,
                border: 0,
                "&:focus": {
                  outline: "none",
                  // --tw-ring-color: transparent !important;
                  "input:hover, input:focus, input:active, input:checked": {
                    "--tw-ring-color": "transparent",
                  },
                },
              }}
              placeholder={isFocused ? "" : "Search for a medication"}
              // placeholder="Search for a medication"
              inputProps={{ "aria-label": "medications search" }}
              //       onChange={(e) => handleFilterChange(e.target.value)}
              // value={searchValue}
              onChange={(e) => handleFilterChange(e.target.value)}
              // value={searchValue}
            />

            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton
              color="primary"
              sx={{ p: "10px" }}
              aria-label="directions"
            >
              <SearchIcon sx={{ color: "#00a651" }} />
            </IconButton>
          </Paper>
        </div>
        {/* ************************************************************************************* */}

        {/* Group of 3 Inline Buttons */}

        <div className="flex pl-10 w-80">
          <div className="mx-auto my-3 flex h-14 w-fit items-center justify-center space-x-4 rounded-2xl bg-green-pri p-4 text-center">
            {["A-to-Z", "ATC", "OTC"].map((group) => (
              <button
                key={group}
                onClick={() => handleGroupButtonClick(group)}
                className={`${classes.outlinedButton} ${
                  activeGroups.includes(group) && classes.activeButton1
                }`}
              >
                {group}
              </button>
            ))}
          </div>

          {/* Grid/List View Toggle Icon */}
          <div className="mt-2 flex justify-end">
            <IconButton
              className={classes.iconButton}
              onClick={handleToggleView}
            >
              {isGridView ? <ViewListIcon /> : <ViewModuleIcon />}
            </IconButton>
          </div>
        </div>

        {/* ************************************************************************************* */}

        {/* Group of 11 Inline Buttons */}
        {showGroupButtons && (
          <div className="mb-3 flex flex-wrap items-center justify-center gap-2 p-1 md:flex-row">
            <button
              onClick={() => handleGroupButtonClick("ClassB")}
              className={`${
                activeGroups.includes("ClassB")
                  ? "bg-green-pri text-white"
                  : "text-green-pri "
              } rounded-full px-4 py-2 hover:transition-all duration-200`}
            >
              Class B
            </button>

            <button
              onClick={() => handleGroupButtonClick("ClassC")}
              className={`${
                activeGroups.includes("ClassC")
                  ? "bg-green-pri text-white"
                  : "text-green-pri "
              } rounded-full px-4 py-2 hover:transition-all duration-200`}
            >
              Class C
            </button>

            <button
              onClick={() => handleGroupButtonClick("ClassD")}
              className={`${
                activeGroups.includes("ClassD")
                  ? "bg-green-pri text-white"
                  : "text-green-pri "
              } rounded-full px-4 py-2 hover:transition-all duration-200`}
            >
              Class D
            </button>

            <button
              onClick={() => handleGroupButtonClick("ClassE")}
              className={`${
                activeGroups.includes("ClassE")
                  ? "bg-green-pri text-white"
                  : "text-green-pri "
              } rounded-full px-4 py-2 hover:transition-all duration-200`}
            >
              Class E
            </button>

            <button
              onClick={() => handleGroupButtonClick("ClassF")}
              className={`${
                activeGroups.includes("ClassF")
                  ? "bg-green-pri text-white"
                  : "text-green-pri "
              } rounded-full px-4 py-2 hover:transition-all duration-200`}
            >
              Class F
            </button>

            <button
              onClick={() => handleGroupButtonClick("ClassG")}
              className={`${
                activeGroups.includes("ClassG")
                  ? "bg-green-pri text-white"
                  : "text-green-pri "
              } rounded-full px-4 py-2 hover:transition-all duration-200`}
            >
              Class G
            </button>

            <button
              onClick={() => handleGroupButtonClick("ClassH")}
              className={`${
                activeGroups.includes("ClassH")
                  ? "bg-green-pri text-white"
                  : "text-green-pri "
              } rounded-full px-4 py-2 hover:transition-all duration-200`}
            >
              Class H
            </button>

            <button
              onClick={() => handleGroupButtonClick("ClassI")}
              className={`${
                activeGroups.includes("ClassI")
                  ? "bg-green-pri text-white"
                  : "text-green-pri "
              } rounded-full px-4 py-2 hover:transition-all duration-200`}
            >
              Class I
            </button>

            <button
              onClick={() => handleGroupButtonClick("ClassJ")}
              className={`${
                activeGroups.includes("ClassJ")
                  ? "bg-green-pri text-white"
                  : "text-green-pri "
              } rounded-full px-4 py-2 hover:transition-all duration-200`}
            >
              Class J
            </button>

            <button
              onClick={() => handleGroupButtonClick("ClassK")}
              className={`${
                activeGroups.includes("ClassK")
                  ? "bg-green-pri text-white"
                  : "text-green-pri "
              } rounded-full px-4 py-2 hover:transition-all duration-200`}
            >
              Class K
            </button>

            <button
              onClick={() => handleGroupButtonClick("ClassL")}
              className={`${
                activeGroups.includes("ClassL")
                  ? "bg-green-pri text-white"
                  : "text-green-pri "
              } rounded-full px-4 py-2 hover:transition-all duration-200`}
            >
              Class L
            </button>
          </div>
        )}

        {/* ************************************************************************************* */}

        {/* Alphabet Filter Buttons */}

        {showAlphabetButtons && (
          <div className="flex flex-wrap justify-center space-x-2">
            {Array.from(Array(26), (_, i) => String.fromCharCode(65 + i)).map(
              (letter) => (
                <button
                  key={letter}
                  onClick={() => handleFilterClick(letter)}
                  className={`${
                    selectedFilters.includes(letter) && classes.activeButton3
                  } text-black-text dark:text-white-text  dark:border-gray-600 `}
                  style={{
                    textTransform: "none",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    margin: "5px",
                    border: "1px solid #00a651",
                    backgroundColor: selectedFilters.includes(letter)
                      ? "#00a651"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: "#00a651",
                    },
                    "&:active": {
                      backgroundColor: "#00a651",
                    },
                  }}
                >
                  {letter}
                </button>
              )
            )}
          </div>
        )}

        {/* ////////////////////////////////////////////////////////////////////////////////////// */}

        {/* Reset Button */}
        {(searchQuery ||
          selectedFilters.length > 0 ||
          activeGroups.length > 0) && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleReset}
              className="text-green-pri hover:text-green-sec"
            >
              Clear all
            </button>
          </div>
        )}
      </Box>

      {/* ////////////////////////////////////////////////////////////////////////////////////// */}

      {/* Display Search Results */}
      <div className="flex flex-col mt-6">
        <div
          className={`${
            isRowView ? "flex flex-col" : "grid"
          } gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`}
        >
          {selectedFilters.length > 0 || activeGroups.length > 0 ? (
            searchResults.length > 0 ? (
              searchResults.map((result) => (
                <div
                  key={result.name}
                  className={`${
                    isRowView
                      ? "bg-white-bg dark:bg-black-fg p-4 dark:border-[#0000000e] border shadow-md rounded-xl mt-4"
                      : "bg-white-bg dark:bg-black-fg p-4 dark:border-[#0000000e] border shadow-md rounded-xl mt-4"
                  }`}
                >
                  <p className="text-xl mb-2 font-normal">{result.name}</p>
                  <p className="text-sm text-gray-400 mb-2">
                    {result.filterClass}
                  </p>
                  <p className="text-sm text-gray-400">{result.class}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No results found.</p>
            )
          ) : (
            <p className="text-gray-500 text-center">
              Search or select filters or groups to show results.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
