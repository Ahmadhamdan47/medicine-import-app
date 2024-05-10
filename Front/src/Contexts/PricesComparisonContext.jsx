/* eslint-disable react/prop-types */
import React, { useState, useContext } from 'react';

// Create Context
const PricesComparisonDataContext = React.createContext();

// Context Provider
export const PricesComparisonProvider = ({ children }) => {
  const [PricesComparisonData, setPricesComparisonData] = useState({
    // Initialize with empty values for all countries
    jordanPrice: '',
    ksaPrice: '',
    kuwaitPrice: '',
    omanPrice: '',
    uaePrice: '',
    bahrainPrice: '',
    qatarPrice: '',
    francePrice: '',
    englandPrice: '',
    belgiumPrice: '',
    switzerlandPrice: '',
    italyPrice: '',
    spainPrice: '',
    portugalPrice: '',
  });

  const handleInputChange = (countryPrice, value) => {
    setPricesComparisonData((prevState) => ({
      ...prevState,
      [countryPrice]: value,
    }));
  };

  return (
    <PricesComparisonDataContext.Provider value={{ PricesComparisonData, handleInputChange }}>
      {children}
    </PricesComparisonDataContext.Provider>
  );
};

// Custom Hook to use FormDataContext
export const usePricesComparisonData = () => useContext(PricesComparisonDataContext);
