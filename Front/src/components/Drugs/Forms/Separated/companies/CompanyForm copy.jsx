import { v4 as uuid4 } from "uuid";
import React, { useState, useEffect } from "react";

import Axios from "../../../../../api/axios";

const CompanyForm = () => {
  const [companyData, setCompanyData] = useState({
    staticCompanyTypeGuid: "",
    name: "",
    nameAr: "",
    phoneNumber: "",
    mobileNumber: "",
    telegramNumber: "",
    whatsAppNumber: "",
    email: "",
    website: "",
    companyaddress: {
      guid: uuid4(),
      countryGuid: "",
      governorateGuid: "",
      districtGuid: "",
      cityGuid: "",
      address: "",
      gpS_X: "",
      gpS_Y: "",
      gpS_Z: "",
    },
  });

  const [companyTypes, setCompanyTypes] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [governorateList, setGovernorateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [cityList, setCityList] = useState([]);

  useEffect(() => {
    // Fetch Company Types
    Axios.get("/api/CompanyType/v1.0/CompanyTypes")
      .then((response) => {
        setCompanyTypes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching company types:", error);
      });

    // Fetch Country List
    Axios.get("/api/country/v1.0/countries")
      .then((response) => {
        setCountryList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching country list:", error);
      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCompanyData({
      ...companyData,
      [name]: value,
    });
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setCompanyData({
      ...companyData,
      companyaddress: {
        ...companyData.companyaddress,
        [name]: value,
      },
    });

    if (name === "countryGuid") {
      // Fetch Governorate List based on selected country
      Axios.get(`/api/Governorates/v1.0/Governorates/${value}`)
        .then((response) => {
          setGovernorateList(response.data);
        })
        .catch((error) => {
          console.error("Error fetching governorate list:", error);
        });
    }

    if (name === "governorateGuid") {
      // Fetch District List based on selected governorate
      Axios.get(`/api/District/v1.0/district/${value}`)
        .then((response) => {
          setDistrictList(response.data);
        })
        .catch((error) => {
          console.error("Error fetching district list:", error);
        });
    }

    if (name === "districtGuid") {
      // Fetch City List based on selected district
      Axios.get(`/api/City/v1.0/City/${value}`)
        .then((response) => {
          setCityList(response.data);
        })
        .catch((error) => {
          console.error("Error fetching city list:", error);
        });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    Axios.post("/api/companies/v1.0", companyData)
      .then((response) => {
        console.log("Company created successfully:", response.data); // Log the response data
      })
      .catch((error) => {
        console.error("Error creating company:", error);
      });
  };

  return (
    <div className="flex flex-col justify-center items-center p-10">
      <form
        className="grid grid-cols-3 gap-6 justify-center"
        onSubmit={handleSubmit}
      >
        <label>
          Company Type:
          <select
            name="staticCompanyTypeGuid"
            value={companyData.staticCompanyTypeGuid}
            onChange={handleInputChange}
          >
            <option value="">Select Company Type</option>
            {companyTypes.map((type) => (
              <option key={type.guid} value={type.guid}>
                {type.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Name:
          <input
            type="text"
            name="name"
            value={companyData.name}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Arabic Name:
          <input
            type="text"
            name="nameAr"
            value={companyData.nameAr}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Phone Number:
          <input
            type="text"
            name="phoneNumber"
            value={companyData.phoneNumber}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Mobile Number:
          <input
            type="text"
            name="mobileNumber"
            value={companyData.mobileNumber}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Telegram Number:
          <input
            type="text"
            name="telegramNumber"
            value={companyData.telegramNumber}
            onChange={handleInputChange}
          />
        </label>

        <label>
          WhatsApp Number:
          <input
            type="text"
            name="whatsAppNumber"
            value={companyData.whatsAppNumber}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={companyData.email}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Website:
          <input
            type="text"
            name="website"
            value={companyData.website}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Country:
          <select
            name="countryGuid"
            value={companyData.companyaddress.countryGuid}
            onChange={handleAddressChange}
          >
            <option value="">Select Country</option>
            {countryList.map((country) => (
              <option key={country.guid} value={country.guid}>
                {country.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Governorate:
          <select
            name="governorateGuid"
            value={companyData.companyaddress.governorateGuid}
            onChange={handleAddressChange}
          >
            <option value="">Select Governorate</option>
            {governorateList.map((governorate) => (
              <option key={governorate.guid} value={governorate.guid}>
                {governorate.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          District:
          <select
            name="districtGuid"
            value={companyData.companyaddress.districtGuid}
            onChange={handleAddressChange}
          >
            <option value="">Select District</option>
            {districtList.map((district) => (
              <option key={district.guid} value={district.guid}>
                {district.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          City:
          <select
            name="cityGuid"
            value={companyData.companyaddress.cityGuid}
            onChange={handleAddressChange}
          >
            <option value="">Select City</option>
            {cityList.map((city) => (
              <option key={city.guid} value={city.guid}>
                {city.name}
              </option>
            ))}
          </select>
        </label>

        {/* <label>
          Country:
          <select
            name="countryGuid"
            value={companyData.companyaddress.countryGuid}
            onChange={handleAddressChange}
          >
            {Array.isArray(countryList) &&
              countryList.map((country) => (
                <option key={country.guid} value={country.guid}>
                  {country.name}
                </option>
              ))}
          </select>
        </label>

        <label>
          Governorate:
          <select
            name="governorateGuid"
            value={companyData.companyaddress.governorateGuid}
            onChange={handleAddressChange}
          >
            <option value="">Select Governorate</option>
            {Array.isArray(governorateList) &&
              governorateList.map((governorate) => (
                <option key={governorate.guid} value={governorate.guid}>
                  {governorate.name}
                </option>
              ))}
          </select>
        </label>

        <label>
          District:
          <select
            name="districtGuid"
            value={companyData.companyaddress.districtGuid}
            onChange={handleAddressChange}
          >
            <option value="">Select District</option>
            {Array.isArray(districtList) &&
              districtList.map((district) => (
                <option key={district.guid} value={district.guid}>
                  {district.name}
                </option>
              ))}
          </select>
        </label>

        <label>
          City:
          <select
            name="cityGuid"
            value={companyData.companyaddress.cityGuid}
            onChange={handleAddressChange}
          >
            <option value="">Select City</option>
            {Array.isArray(cityList) &&
              cityList.map((city) => (
                <option key={city.guid} value={city.guid}>
                  {city.name}
                </option>
              ))}
          </select>
        </label> */}

        <label>
          Address:
          <input
            type="text"
            name="address"
            value={companyData.companyaddress.address}
            onChange={handleAddressChange}
          />
        </label>

        <label>
          GPS_X:
          <input
            type="text"
            name="gpS_X"
            value={companyData.companyaddress.gpS_X}
            onChange={handleAddressChange}
          />
        </label>

        <label>
          GPS_Y:
          <input
            type="text"
            name="gpS_Y"
            value={companyData.companyaddress.gpS_Y}
            onChange={handleAddressChange}
          />
        </label>

        <label>
          GPS_Z:
          <input
            type="text"
            name="gpS_Z"
            value={companyData.companyaddress.gpS_Z}
            onChange={handleAddressChange}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CompanyForm;
