/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";
import axios from "axios";
// Create a context
const DrugOrderContext = createContext();

// Custom hook to consume the DrugOrderContext
export const useDrugOrder = () => {
  const context = useContext(DrugOrderContext);
  if (!context) {
    throw new Error("useDrugOrder must be used within an DrugOrderProvider");
  }
  return context;
};

// DrugOrderProvider component to wrap your application with
export const DrugOrderProvider = ({ children }) => {
  // Define your submitOrder function
  const submitOrder = async (guid, quantity) => {
    try {
      // Simulate fetching drug data by GUID
      const drug = { BrandName: "DrugName", DrugId: 123, Guid: guid }; // Simulated drug data
      if (!drug) {
        throw new Error("Drug not found");
      }

      // Simulate creating submitted order
      const order = { orderId: 456 }; // Simulated order data

      // Simulate creating RFI
      const rfi = { orderId: order.orderId }; // Simulated RFI data

      return order;
    } catch (error) {
      console.error(error);
      throw new Error("Error in orderService: " + error.message);
    }
  };

  const [formData, setFormData] = useState({
    drugId: "",
    brandName: "",
    quantityRequested: "",
    RFI: false,
    Result: false,
    PI: false,
    swift: false,
    invoice: false,
    rfd: false,
    stock: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the form data to the backend
      const response = await axios.post("http://localhost:3000/submittedOrders/submit", formData);
      console.log("Order submitted:", response.data);
      // Clear form after submission
      setFormData({
        drugId: "",
        brandName: "",
        quantityRequested: "",
        RFI: false,
        Result: false,
        PI: false,
        swift: false,
        invoice: false,
        rfd: false,
        stock: false,
      });
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  // Value to be provided to the context
  const value = {
    submitOrder,
    handleChange,
    handleSubmit,
    setFormData
  };

  return (
    <DrugOrderContext.Provider value={value}>
      {children}
    </DrugOrderContext.Provider>
  );
};
