 
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useContext } from 'react';

const InspectionContext = React.createContext();

export const useInspection = () => useContext(InspectionContext);

export const InspectionProvider = ({ children }) => {
  const [batchComponents, setBatchComponents] = useState([]);
  const [shipmentFormData, setShipmentFormData] = useState({});
  const steps = ['Shipment', 'Declaration Status & Agent Stock'];
  const [currentStep, setCurrentStep] = useState(0);
  const [batchesQty, setBatchesQty] = useState(0);

  // Add BatchSerials related states and functions
  const [numSerials, setNumSerials] = useState(1);
  const [serialValues, setSerialValues] = useState(Array(numSerials).fill(''));

  const handleInputChange = (index, event) => {
    const values = [...serialValues];
    values[index] = event.target.value;
    setSerialValues(values);
  };

  const handleShipmentFormChange = (data) => {
    setShipmentFormData((prevData) => ({
      ...prevData,
      ...data, // Merge new form data with existing form data
    }));
  };

  const handleNumSerialsChange = (event) => {
    let newNumSerials = parseInt(event.target.value);
    if (isNaN(newNumSerials)) newNumSerials = 0;
    setNumSerials(newNumSerials);
    setSerialValues(Array(newNumSerials).fill(''));
  };

  const handleBatchesQtyChange = (qty) => {
    setBatchesQty(qty);

    // Update batch components state based on the new quantity
    setBatchComponents((prevBatchComponents) => {
      const updatedBatchComponents = [...prevBatchComponents];

      // Remove excess batch components if decreasing quantity
      if (qty < updatedBatchComponents.length) {
        updatedBatchComponents.splice(qty);
      }

      // Add new batch components if increasing quantity
      if (qty > updatedBatchComponents.length) {
        for (let i = updatedBatchComponents.length; i < qty; i++) {
          updatedBatchComponents.push({});
        }
      }

      return updatedBatchComponents;
    });
  };

  const handleBatchComponentChange = (index, newData) => {
    const updatedBatchComponents = [...batchComponents];
    updatedBatchComponents[index] = newData;
    setBatchComponents(updatedBatchComponents);
  };

  const handleAdd = () => {
    // console.log("Serial numbers:", serialValues);
    onAddSerials(serialValues);
    onClose();
  };

  const handlePaste = () => {
    navigator.clipboard.readText().then((text) => {
      const serials = text.split(/\n|\s+/).filter((serial) => serial.trim() !== '');
      if (serials.length <= numSerials) {
        setSerialValues(serials);
      } else {
        setSerialValues(serials.slice(0, numSerials));
      }
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    handleAddSerials(serialValues);
    onClose();
  };

  const contextValue = {
    batchComponents,
    shipmentFormData,
    steps,
    currentStep,
    batchesQty,
    handleShipmentFormChange,
    handleBatchesQtyChange,
    handleBatchComponentChange,
    numSerials,
    setNumSerials,
    serialValues,
    setSerialValues,
    handleInputChange,
    handleNumSerialsChange,
    handleAdd,
    handlePaste,
    handleSubmit,
  };

  return <InspectionContext.Provider value={contextValue}>{children}</InspectionContext.Provider>;
};
