import React, { useState, useEffect, useContext, createContext } from "react";

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  // Check localStorage for user's preferred dark mode setting
  const storedDarkMode = localStorage.getItem("darkMode");
  const initialDarkMode = storedDarkMode ? JSON.parse(storedDarkMode) : false;

  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    // Save the dark mode state to localStorage
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));

    // Apply dark mode to the body
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);
