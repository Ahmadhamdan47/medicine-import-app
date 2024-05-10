import axios from "axios";
import React, { useState, useEffect, useContext, createContext } from "react";

// Create a context for RFI and order data
const ImportationContext = createContext();
export const useRFI = () => useContext(ImportationContext);

export const useImportation = () => useContext(ImportationContext);

export const ImportationProvider = ({ children }) => {
  const [rfiFormData, setRfiFormData] = useState({});
  const [orderData, setOrderData] = useState({});
  const [drugs, setDrugs] = useState([]);
  const [isInputsEnabled, setIsInputsEnabled] = useState(false);

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rfiResponse, drugsResponse] = await Promise.all([
          axios.get("/rfi"),
          axios.get("/drugs"),
        ]);

        setRfiFormData(rfiResponse.data);
        setDrugs(drugsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    setRfiFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const handleOrderInputChange = (field, value) => {
    setOrderData((prevOrderData) => ({
      ...prevOrderData,
      [field]: value,
    }));
  };

  const handleCheckboxChange = () => {
    setIsInputsEnabled(!isInputsEnabled);
  };

  const saveRFI = async () => {
    try {
      const response = await axios.post("/rfis", rfiFormData);
      console.log("RFI created:", response.data);
    } catch (error) {
      console.error("Error creating RFI:", error);
    }
  };

  const updateRFI = async () => {
    try {
      const response = await axios.put(
        `/rfi/edit/${rfiFormData.rfiId}`,
        rfiFormData
      );
      console.log("RFI updated:", response.data);
    } catch (error) {
      console.error("Error updating RFI:", error);
    }
  };

  const deleteRFI = async () => {
    try {
      const response = await axios.delete(`/rfi/delete/${rfiFormData.rfiId}`);
      console.log("RFI deleted:", response.data);
    } catch (error) {
      console.error("Error deleting RFI:", error);
    }
  };

  const submitRFI = async (rfiData) => {
    try {
      // Assuming axios is used for API requests, send a POST request to submit RFI data
      const response = await axios.post("/rfi", rfiData);
      console.log("RFI submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting RFI:", error);
      // Handle error, show an error message to the user, etc.
    }
  };

  // const submitOrder = async () => {
  //   try {
  //     // Check if all required order data fields are present
  //     if (!orderData.brandName || !orderData.quantity || !orderData.amount) {
  //       throw new Error("Please fill in all required fields for the order.");
  //     }

  //     // Perform validation or additional processing if needed

  //     // Assuming axios is used for API requests, send a POST request to submit order data
  //     const response = await axios.post("/orders", orderData);
  //     console.log("Order submitted successfully:", response.data);

  //     // Optionally, reset the orderData state after successful submission
  //     setOrderData({});
  //   } catch (error) {
  //     console.error("Error submitting order:", error.message);
  //     // Handle error, show an error message to the user, etc.
  //   }
  // };

  const submitOrder = async (orderData) => {
    try {
      // Assuming axios is used for API requests, send a POST request to submit order data
      const response = await axios.post("/orders", orderData);
      console.log("Order submitted successfully:", response.data);

      // Optionally, update the state or perform additional actions
    } catch (error) {
      console.error("Error submitting order:", error.message);
      // Handle error, show an error message to the user, etc.
    }
  };

  return (
    <ImportationContext.Provider
      value={{
        rfiFormData,
        submitRFI,
        orderData,
        drugs,
        isInputsEnabled,
        handleInputChange,
        handleOrderInputChange,
        handleCheckboxChange,
        saveRFI,
        updateRFI,
        deleteRFI,
        submitOrder,
      }}
    >
      {children}
    </ImportationContext.Provider>
  );
};
