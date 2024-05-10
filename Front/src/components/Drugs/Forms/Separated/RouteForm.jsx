import React, { useState, useContext } from "react"; // Import useContext from React
import axios from "axios";

import AuthContext from "../../../../context/AuthProvider";

const RouteForm = () => {
  const { auth } = useContext(AuthContext);
  const accessToken = auth?.accessToken;

  const [formData, setFormData] = useState({
    code: "string",
    name: "string",
    nameAr: "string",
    definition: "string",
    enabled: true,
    isParentals: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("AccessToken:", accessToken); // Log accessToken

    try {
      if (!accessToken) {
        console.error("No access token available.");
        return;
      }

      // Generate a new GUID using uuid
      const newGuid = require("uuid").v4();

      // Set the current date and time as the createdDate
      const newCreatedDate = new Date().toISOString();

      // Update the form data with the generated values
      const updatedFormData = {
        ...formData,
        guid: newGuid,
        createdDate: newCreatedDate,
      };

      // Send the access token in the Authorization header for authorization
      const response = await axios.post(
        "http://1.1.1.250:3500/api/route/v1.0", // Update the route as needed
        updatedFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("RouteForm submission successful:", response.data);
      // Handle success as needed
    } catch (error) {
      console.error("RouteForm submission failed:", error);
      // Handle errors as needed
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <form className="flex flex-col p-14" onSubmit={handleSubmit}>
      <label htmlFor="guid">GUID:</label>
      <input type="text" id="guid" name="guid" value={formData.guid} readOnly />

      <label htmlFor="code">Code:</label>
      <input
        type="text"
        id="code"
        name="code"
        value={formData.code}
        onChange={handleChange}
      />

      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />

      <label htmlFor="nameAr">Name (Arabic):</label>
      <input
        type="text"
        id="nameAr"
        name="nameAr"
        value={formData.nameAr}
        onChange={handleChange}
      />

      <label htmlFor="definition">Definition:</label>
      <input
        type="text"
        id="definition"
        name="definition"
        value={formData.definition}
        onChange={handleChange}
      />

      <label htmlFor="enabled">Enabled:</label>
      <input
        type="checkbox"
        id="enabled"
        name="enabled"
        checked={formData.enabled}
        onChange={handleChange}
      />

      <label htmlFor="isParentals">Is Parentals:</label>
      <input
        type="checkbox"
        id="isParentals"
        name="isParentals"
        checked={formData.isParentals}
        onChange={handleChange}
      />

      <label htmlFor="createdDate">Created Date:</label>
      <input
        type="text"
        id="createdDate"
        name="createdDate"
        value={formData.createdDate}
        readOnly
      />

      {/* <input type="submit" value="Submit" /> */}
      <button className="mt-6 bg-green-600 w-52" type="submit">
        Submit Route
      </button>
    </form>
  );
};

export default RouteForm;
