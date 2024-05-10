/* eslint-disable react/prop-types */
 
import React, { useState, useContext, createContext } from 'react';

// Create a context
const DrugRegistryAddonsContext = createContext();

// Custom hook to use the context
export const useDrugRegistryAddons = () => useContext(DrugRegistryAddonsContext);

// Provider component to wrap your application
export const DrugRegistryAddonsProvider = ({ children }) => {
  const [formDataStep11, setFormDataStep11] = useState({
    Description: '',
    ActiveInactiveIngredient: '',
    Posology: '',
    MethodOfAdministration: '',
    Contraindications: '',
    PrecautionForUse: '',
    EffectOnFGN: '',
    SideEffect: '',
    Toxicity: '',
    StorageCondition: '',
    ShelfLife: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDataStep11((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const contextValue = {
    formDataStep11,
    handleInputChange,
  };

  return (
    <DrugRegistryAddonsContext.Provider value={contextValue}>
      {children}
    </DrugRegistryAddonsContext.Provider>
  );
};
