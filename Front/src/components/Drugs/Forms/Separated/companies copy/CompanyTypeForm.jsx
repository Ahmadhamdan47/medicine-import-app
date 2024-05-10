import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";

import Axios from "../../../../../api/axios";

const CompanyTypeForm = () => {
  const [formData, setFormData] = useState({
    guid: uuidv4(),
    name: "",
    nameAr: "",
    enabled: true,
    createdDate: new Date().toISOString(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Axios.post("/api/companyType/v1.0", formData);
      alert("Data submitted successfully");
      // Optionally, clear the form fields after successful submission
      setFormData({
        guid: "",
        name: "",
        nameAr: "",
        enabled: true,
        createdDate: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("An error occurred while submitting data");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="nameAr">Name (Arabic):</label>
        <input
          type="text"
          id="nameAr"
          name="nameAr"
          value={formData.nameAr}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default CompanyTypeForm;
