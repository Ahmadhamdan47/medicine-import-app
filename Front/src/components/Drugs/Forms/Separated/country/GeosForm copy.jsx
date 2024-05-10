import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import React, { useState } from "react";

import Axios from "../../../../../api/axios";



const GeosForm = () => {
  const [formData, setFormData] = useState({
    // Country fields
    guid: uuidv4(),
    code: "",
    name: "",
    nameAr: "",
    enabled: true,
    createdDate: new Date().toISOString(),
    isNearByCountry: true,
    isReferenceCountry: true,
    isComparative: true,
    // Governorates fields
    guid: "",
    staticCountryGuid: "",
    code: "",
    govName: "",
    govNameAr: "",
    enabled: true,
    createdDate: new Date().toISOString(),
    // Districts fields
    guid: "",
    governorateGuid: "",
    code: "",
    distName: "",
    distNameAr: "",
    enabled: true,
    createdDate: new Date().toISOString(),
    // Cities fields
    guid: "",
    districtGuid: "",
    code: "",
    cityName: "",
    cityNameAr: "",
    enabled: true,
    createdDate: new Date().toISOString(),
  });

  const [countryList, setCountryList] = useState([]);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Generate GUID for the new record in Country records
      const staticCountryGuid = uuidv4();
      // Perform API call to create a new record in Country records
      await Axios.post("/api/country/v1.0", {
        guid: staticCountryGuid,
        code: formData.code,
        name: formData.name,
        nameAr: formData.nameAr,
        enabled: formData.enabled,
      });

      // Generate GUID for the new record in Governorate records
      const governorateGuid = uuidv4();
      // Perform API call to create a new record in Governorate records
      await Axios.post("/api/governorates/v1.0", {
        guid: governorateGuid,
        code: formData.staticCountryGuid,
        staticCountryGuid,
        name: formData.govName,
        nameAr: formData.govNameAr,
        enabled: formData.enabled,
      });

      // Generate GUID for the new record in Districts records
      const districtGuid = uuidv4();
      // Perform API call to create a new record in Districts records
      await Axios.post("/api/district/v1.0", {
        guid: districtGuid,
        code: formData.distCode, // Assuming there's a field for District code in the form
        governorateGuid,
        name: formData.distName,
        nameAr: formData.distNameAr,
        enabled: formData.enabled,
      });
      console.log("district GUID 1", districtGuid);
      // Perform API call to create a new record in Cities records
      await Axios.post("/api/city/v1.0", {
        guid: uuidv4(),
        code: formData.cityCode, // Assuming there's a field for City code in the form
        districtGuid,
        name: formData.cityName,
        nameAr: formData.cityNameAr,
        enabled: formData.enabled,
      });

      console.log("Form submitted successfully");
    } catch (error) {
      console.error("Error submitting form data:", error);
      setError("Failed to submit form data");
    } finally {
      // Reset form fields after form submission (whether successful or not)
      resetFormData();
      console.log("district GUID 2", districtGuid);
    }
  };
  // console.log("district GUID 2", districtGuid);
  const resetFormData = () => {
    setFormData({
      // Counrty fields
      guid: "",
      code: "",
      name: "",
      nameAr: "",
      enabled: true,
      isNearByCountry: true,
      isReferenceCountry: true,
      isComparative: true,
      // Governorate fields
      guid: "",
      staticCountryGuid: "",
      govCode: "",
      govName: "",
      govNameAr: "",
      enabled: true,
      // District fields
      guid: "",
      governorateGuid: "",
      distCode: "",
      distName: "",
      distNameAr: "",
      enabled: true,
      // Cities fields
      guid: "",
      districtGuid: "",
      cityCode: "",
      cityName: "",
      cityNameAr: "",
      enabled: true,
    });
  };

  return (
    <div className="flex flex-col p-6 mx-auto">
      <form
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 p-4 py-14 md:p-8"
        onSubmit={handleSubmit}
      >
        {/* Country fields */}
        <div className="flex flex-col gap-6">
          <h3 className="text-green-pri">Country</h3>
          <label className="flex flex-col">
            Counrty Code:
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              placeholder="+961"
              autoFocus
            />
          </label>

          <label className="flex flex-col">
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </label>

          <label className="flex flex-col">
            Name (Arabic):
            <input
              type="text"
              name="nameAr"
              value={formData.nameAr}
              onChange={handleInputChange}
            />
          </label>
        </div>

        {/* Governorates fields */}
        <div className="flex flex-col gap-6">
          <h3 className="text-green-pri">Governorates</h3>
          <label className="flex flex-col">
            Code:
            <input
              type="text"
              name="staticCountryGuid"
              value={formData.staticCountryGuid}
              onChange={handleInputChange}
              required
            />
          </label>

          <label className="flex flex-col">
            Name:
            <input
              type="text"
              name="govName"
              value={formData.govName}
              onChange={handleInputChange}
              required
            />
          </label>

          <label className="flex flex-col">
            Name (Arabic):
            <input
              type="text"
              name="govNameAr"
              value={formData.govNameAr}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>

        {/* Districts fields */}
        <div className="flex flex-col gap-6">
          <h3 className="text-green-pri">Districts</h3>
          <label className="flex flex-col">
            Code:
            <input
              type="text"
              name="distCode"
              value={formData.distCode}
              onChange={handleInputChange}
              required
            />
          </label>

          <label className="flex flex-col">
            Name:
            <input
              type="text"
              name="distName"
              value={formData.distName}
              onChange={handleInputChange}
              required
            />
          </label>

          <label className="flex flex-col">
            Name (Arabic):
            <input
              type="text"
              name="distNameAr"
              value={formData.distNameAr}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>

        {/* Cities fields */}
        <div className="flex flex-col gap-6">
          <h3 className="text-green-pri">Cities</h3>
          <label className="flex flex-col">
            Code:
            <input
              type="text"
              name="cityCode"
              value={formData.cityCode}
              onChange={handleInputChange}
              required
            />
          </label>

          <label className="flex flex-col">
            Name:
            <input
              type="text"
              name="cityName"
              value={formData.cityName}
              onChange={handleInputChange}
              required
            />
          </label>

          <label className="flex flex-col">
            Name (Arabic):
            <input
              type="text"
              name="cityNameAr"
              value={formData.cityNameAr}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>

        <div className="btns-col col-span-full flex justify-between">
          <Link to="/geo/list" className="med-btn-pri">
            Go to data records
          </Link>

          <button className="med-btn-sec w-24" type="submit">
            Submit
          </button>
        </div>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default GeosForm;
