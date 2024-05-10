import React, { useState, useEffect, useContext, createContext } from "react";

interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {}
});

export const DarkModeProvider: React.FC = ({ children }) => {
  // Your component code here
};

export const useDarkMode = (): DarkModeContextType => useContext(DarkModeContext);
