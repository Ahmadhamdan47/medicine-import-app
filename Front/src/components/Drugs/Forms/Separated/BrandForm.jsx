import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";

const BrandForm = () => {
  const [formData, setFormData] = useState({
    Name: "",
    NameAr: "",
    Enabled: true,
    CountryGuid: uuidv4(), // Generate a UUID for CountryGuid
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://1.1.1.250:3500/api/brands/v1.0",
        formData
      );
      console.log("Brand added successfully:", response.data);
    } catch (error) {
      console.error("Error adding brand:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8 p-4 bg-gray-100 shadow-md rounded-md"
    >
      <label className="block mb-2">
        Name:
        <input
          type="text"
          name="Name"
          value={formData.Name}
          onChange={handleChange}
          className="form-input mt-1 block w-full"
        />
      </label>

      <label className="block mb-2">
        Name Arabic:
        <input
          type="text"
          name="NameAr"
          value={formData.NameAr}
          onChange={handleChange}
          className="form-input mt-1 block w-full"
        />
      </label>

      <label className="block mb-2">
        Enabled:
        <input
          type="checkbox"
          name="Enabled"
          checked={formData.Enabled}
          onChange={handleChange}
          className="form-checkbox mt-1 block"
        />
      </label>

      <label className="block mb-2">
        Country:
        <select
          name="CountryGuid"
          value={formData.CountryGuid}
          onChange={handleChange}
          className="form-select mt-1 block w-full"
        >
          <option value="country1">Country 1</option>
          <option value="country2">Country 2</option>
          {/* Add more options based on your data */}
        </select>
      </label>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
      >
        Submit
      </button>
    </form>
  );
};

export default BrandForm;
