import { v4 as uuidv4 } from "uuid";
import React, { useState, useContext, createContext } from "react";

import Axios from "../../../../../api/axios";
// Create a context to manage form data and modal visibility
const GeoFormContext = createContext();

// Create a provider for the GeoFormContext
export const GeoFormProvider = ({ children }) => {
  // Define state variables for form data
  const [code, setCode] = useState("");
  const [englishName, setEnglishName] = useState("");
  const [arabicName, setArabicName] = useState("");
  const [governorates, setGovernorates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Define state variables for modal visibility
  const [showGovernorateModal, setShowGovernorateModal] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);

  // Function to handle changes in governorate data
  const handleGovernorateChange = (govIndex, key, value) => {
    const updatedGovernorates = [...governorates];
    updatedGovernorates[govIndex] = {
      ...updatedGovernorates[govIndex],
      [key]: value,
    };
    setGovernorates(updatedGovernorates);
  };

  // Function to handle changes in district data
  const handleDistrictChange = (govIndex, distIndex, key, value) => {
    const updatedDistricts = [...districts];
    updatedDistricts[govIndex].districts[distIndex] = {
      ...updatedDistricts[govIndex].districts[distIndex],
      [key]: value,
    };
    setDistricts(updatedDistricts);
  };

  // Function to handle changes in city data
  const handleCityChange = (govIndex, distIndex, cityIndex, key, value) => {
    const updatedDistricts = [...districts];
    updatedDistricts[govIndex].districts[distIndex].cities[cityIndex] = {
      ...updatedDistricts[govIndex].districts[distIndex].cities[cityIndex],
      [key]: value,
    };
    setDistricts(updatedDistricts);
  };

  // Function to handle form submission
  const handleSubmit = async (e, countryGuid) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Post governorates, districts, and cities data
      await Promise.all(
        governorates.map(async (governorate) => {
          const governorateGuid = uuidv4();
          await Axios.post("/api/governorates/v1.0", {
            guid: governorateGuid,
            code: governorate.code,
            name: governorate.name,
            nameAr: governorate.nameAr,
            enabled: true,
            createdDate: new Date().toISOString(),
            staticCountryGuid: countryGuid,
          });
          console.log("Governorate data posted successfully");

          return Promise.all(
            governorate.districts.map(async (district) => {
              const districtGuid = uuidv4();
              await Axios.post("/api/district/v1.0", {
                guid: districtGuid,
                code: district.code,
                name: district.name,
                nameAr: district.nameAr,
                enabled: true,
                createdDate: new Date().toISOString(),
                governorateGuid,
              });
              console.log("District data posted successfully");

              return Promise.all(
                district.cities.map(async (city) => {
                  await Axios.post("/api/city/v1.0", {
                    guid: uuidv4(),
                    code: city.code,
                    name: city.name,
                    nameAr: city.nameAr,
                    enabled: true,
                    createdDate: new Date().toISOString(),
                    districtGuid,
                  });
                  console.log("City data posted successfully");
                })
              );
            })
          );
        })
      );
      setSuccessMessage("Data submitted successfully!");
    } catch (error) {
      console.error("Error posting data:", error);
      setError("Error submitting data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addDistrict = () => {
    const newDistrict = {
      code: "", // Set initial values as needed
      name: "",
      nameAr: "",
    };

    setDistricts((prevDistricts) => [...prevDistricts, newDistrict]);
  };

  const addCity = (govIndex, distIndex) => {
    const newCity = {
      code: "", // Set initial values as needed
      name: "",
      nameAr: "",
    };

    // Update cities array within the specified district
    setDistricts((prevDistricts) =>
      prevDistricts.map((district, index) => {
        if (index === distIndex) {
          return {
            ...district,
            cities: [...district.cities, newCity],
          };
        }
        return district;
      })
    );
  };

  // Functions to toggle modal visibility
  const toggleGovernorateModal = () => {
    setShowGovernorateModal(!showGovernorateModal);
  };

  const toggleDistrictModal = () => {
    setShowDistrictModal(!showDistrictModal);
  };

  const toggleCityModal = () => {
    setShowCityModal(!showCityModal);
  };

  const handleAddGovernorate = () => {
    const newGovernorate = {
      code: "", // Placeholder initial values
      name: "",
      nameAr: "",
      districts: [], // Initialize districts as an empty array
    };

    setGovernorates((prevGovernorates) => [
      ...prevGovernorates,
      newGovernorate,
    ]);
  };

  const value = {
    code,
    setCode,
    englishName,
    setEnglishName,
    arabicName,
    setArabicName,
    governorates,
    setGovernorates,
    districts,
    setDistricts,
    cities,
    setCities,
    isLoading,
    setIsLoading,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    handleSubmit,
    handleAddGovernorate,
    handleGovernorateChange,
    handleDistrictChange,
    handleCityChange,
    addDistrict,
    addCity,
    toggleGovernorateModal,
    toggleDistrictModal,
    toggleCityModal,
    showGovernorateModal,
    showDistrictModal,
    showCityModal,
  };

  return (
    <GeoFormContext.Provider value={value}>{children}</GeoFormContext.Provider>
  );
};

export const useGeoFormContext = () => useContext(GeoFormContext);
