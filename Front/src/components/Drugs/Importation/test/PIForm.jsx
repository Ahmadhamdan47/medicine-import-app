import React, { useState } from "react";

import Axios from "../../../../api/axios";
import { useRFI } from "../ImportationContext";

const PIForm = () => {
  const { rfiFormData } = useRFI();
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    date: "",
    amount: "",
    attachedFile: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileInputChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      attachedFile: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post("/api/pi", formData);
      console.log("PI created:", response.data);
      // Reset form after successful submission
      setFormData({
        invoiceNumber: "",
        date: "",
        amount: "",
        attachedFile: null,
      });
    } catch (error) {
      console.error("Error creating PI:", error);
    }
  };

  return (
    <div>
      <h2>PI Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="invoiceNumber">Invoice Number:</label>
          <input
            type="text"
            id="invoiceNumber"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="attachedFile">Attached File:</label>
          <input
            type="file"
            id="attachedFile"
            name="attachedFile"
            onChange={handleFileInputChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PIForm;
