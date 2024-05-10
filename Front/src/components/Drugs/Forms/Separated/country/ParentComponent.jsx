import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";

import Axios from "../../../../../api/axios";
// Import useContext hook



const ParentComponent = ({ countryGuid }) => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    nameAr: "",
    governorates: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const countryData = {
        guid: countryGuid,
        code: formData.code,
        name: formData.name,
        nameAr: formData.nameAr,
        enabled: true,
        createdDate: new Date().toISOString(),
      };

      // Post country data to its endpoint
      await Axios.post("/api/country/v1.0", countryData);
      console.log("Country data posted successfully:", countryData);

      // Post governorates, districts, and cities data
      await Promise.all(
        formData.governorates.map(async (governorate) => {
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
          console.log("Governorate data posted successfully:", governorate);

          await Promise.all(
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
              console.log("District data posted successfully:", district);

              await Promise.all(
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
                  console.log("City data posted successfully:", city);
                })
              );
            })
          );
        })
      );

      // Reset form data
      setFormData({
        code: "",
        name: "",
        nameAr: "",
        governorates: [],
      });
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const handleAddGovernorate = () => {
    setFormData((prevData) => ({
      ...prevData,
      governorates: [
        ...prevData.governorates,
        { code: "", name: "", nameAr: "", districts: [] },
      ],
    }));
  };

  const handleAddDistrict = (govIndex) => {
    setFormData((prevData) => {
      const updatedGovernorates = [...prevData.governorates];
      updatedGovernorates[govIndex].districts.push({
        code: "",
        name: "",
        nameAr: "",
        cities: [],
      });
      return { ...prevData, governorates: updatedGovernorates };
    });
  };

  const handleAddCity = (govIndex, distIndex) => {
    setFormData((prevData) => {
      const updatedGovernorates = [...prevData.governorates];
      updatedGovernorates[govIndex].districts[distIndex].cities.push({
        code: "",
        name: "",
        nameAr: "",
      });
      return { ...prevData, governorates: updatedGovernorates };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGovernorateChange = (govIndex, field, value) => {
    setFormData((prevData) => {
      const updatedGovernorates = [...prevData.governorates];
      updatedGovernorates[govIndex][field] = value;
      return { ...prevData, governorates: updatedGovernorates };
    });
  };

  const handleDistrictChange = (govIndex, distIndex, field, value) => {
    setFormData((prevData) => {
      const updatedGovernorates = [...prevData.governorates];
      updatedGovernorates[govIndex].districts[distIndex][field] = value;
      return { ...prevData, governorates: updatedGovernorates };
    });
  };

  const handleCityChange = (govIndex, distIndex, cityIndex, field, value) => {
    setFormData((prevData) => {
      const updatedGovernorates = [...prevData.governorates];
      updatedGovernorates[govIndex].districts[distIndex].cities[cityIndex][
        field
      ] = value;
      return { ...prevData, governorates: updatedGovernorates };
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Country</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="code">Code:</label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
          />
          <label htmlFor="name">Name (English):</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <label htmlFor="nameAr">Name (Arabic):</label>
          <input
            type="text"
            id="nameAr"
            name="nameAr"
            value={formData.nameAr}
            onChange={handleInputChange}
          />
          {/* Button to add governorate */}
          <button type="button" onClick={handleAddGovernorate}>
            Add Governorate
          </button>
          {/* Render governorate forms */}
          {formData.governorates.map((governorate, govIndex) => (
            <div key={govIndex}>
              <h3>Governorate {govIndex + 1}</h3>
              <label>Governorate Code:</label>
              <input
                type="text"
                value={governorate.code}
                onChange={(e) =>
                  handleGovernorateChange(govIndex, "code", e.target.value)
                }
              />
              <label>Name (English):</label>
              <input
                type="text"
                value={governorate.name}
                onChange={(e) =>
                  handleGovernorateChange(govIndex, "name", e.target.value)
                }
              />
              <label>Name (Arabic):</label>
              <input
                type="text"
                value={governorate.nameAr}
                onChange={(e) =>
                  handleGovernorateChange(govIndex, "nameAr", e.target.value)
                }
              />
              {/* Button to add district */}
              <button type="button" onClick={() => handleAddDistrict(govIndex)}>
                Add District
              </button>
              {/* Render district forms */}
              {governorate.districts.map((district, distIndex) => (
                <div key={distIndex}>
                  <h4>District {distIndex + 1}</h4>
                  <label>District Code:</label>
                  <input
                    type="text"
                    value={district.code}
                    onChange={(e) =>
                      handleDistrictChange(
                        govIndex,
                        distIndex,
                        "code",
                        e.target.value
                      )
                    }
                  />
                  <label>Name (English):</label>
                  <input
                    type="text"
                    value={district.name}
                    onChange={(e) =>
                      handleDistrictChange(
                        govIndex,
                        distIndex,
                        "name",
                        e.target.value
                      )
                    }
                  />
                  <label>Name (Arabic):</label>
                  <input
                    type="text"
                    value={district.nameAr}
                    onChange={(e) =>
                      handleDistrictChange(
                        govIndex,
                        distIndex,
                        "nameAr",
                        e.target.value
                      )
                    }
                  />
                  {/* Button to add city */}
                  <button
                    type="button"
                    onClick={() => handleAddCity(govIndex, distIndex)}
                  >
                    Add City
                  </button>
                  {/* Render city forms */}
                  {district.cities.map((city, cityIndex) => (
                    <div key={cityIndex}>
                      <h5>City {cityIndex + 1}</h5>
                      <label>City Code:</label>
                      <input
                        type="text"
                        value={city.code}
                        onChange={(e) =>
                          handleCityChange(
                            govIndex,
                            distIndex,
                            cityIndex,
                            "code",
                            e.target.value
                          )
                        }
                      />
                      <label>Name (English):</label>
                      <input
                        type="text"
                        value={city.name}
                        onChange={(e) =>
                          handleCityChange(
                            govIndex,
                            distIndex,
                            cityIndex,
                            "name",
                            e.target.value
                          )
                        }
                      />
                      <label>Name (Arabic):</label>
                      <input
                        type="text"
                        value={city.nameAr}
                        onChange={(e) =>
                          handleCityChange(
                            govIndex,
                            distIndex,
                            cityIndex,
                            "nameAr",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
          <div className="modal-actions">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParentComponent;
