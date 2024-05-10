import { v4 as uuidv4 } from "uuid";
import { atom, useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

import Axios from "../../../../../api/axios";

const generateGUID = uuidv4();

const brandFormDataAtom = atom({
  guid: generateGUID,
  countryGuid: "",
  countryName: "",
  countryNameAr: "",
  name: "",
  nameAr: "",
  enabled: true,
  createdDate: new Date().toISOString(),
});

const BrandForm = () => {
  const [brandFormData, setBrandFormData] = useAtom(brandFormDataAtom);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await Axios.get("/api/country/v1.0/countries");
        setCountries(response.data);
        setLoading(false); // Set loading to false after fetching countries
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrandFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make POST request to submit brand data
      await Axios.post("/api/brands/v1.0/", brandFormData);
      alert("Data submitted successfully");

      // Reset form after successful submission
      setBrandFormData({
        guid: generateGUID,
        countryGuid: "",
        countryName: "",
        countryNameAr: "",
        name: "",
        nameAr: "",
        enabled: true,
        createdDate: new Date().toISOString(),
      });

      // Navigate to new route after successful submission
      navigate("/brands/list/");
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("An error occurred while submitting data");
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Render loading indicator
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-4">
        <label htmlFor="countryGuid" className="block mb-1">
          Country:
        </label>
        <select
          id="countryGuid"
          name="countryGuid"
          value={brandFormData.countryGuid}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded border dark:border-white-text bg-white-bg dark:bg-black-bg dark:text-white-text focus:outline-none focus:ring-2 focus:ring-green-pri"
        >
          <option value="">Select a country</option>
          {countries.map((country) => (
            <option key={country.guid} value={country.guid}>
              {country.name} ({country.nameAr})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="name" className="block mb-1">
          Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={brandFormData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded border dark:border-white-text bg-white-bg dark:bg-black-bg dark:text-white-text focus:outline-none focus:ring-2 focus:ring-green-pri"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="nameAr" className="block mb-1">
          Name (Arabic):
        </label>
        <input
          type="text"
          id="nameAr"
          name="nameAr"
          value={brandFormData.nameAr}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded border dark:border-white-text bg-white-bg dark:bg-black-bg dark:text-white-text focus:outline-none focus:ring-2 focus:ring-green-pri"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-green-pri text-white rounded hover:bg-green-dark focus:outline-none focus:ring-2 focus:ring-green-dark"
      >
        Submit
      </button>
    </form>
  );
};

export default BrandForm;
