import { v4 as uuidv4 } from "uuid";
import React, { useState, useEffect } from "react";

import Axios from "../../../../api/axios";

const StaticData = () => {
  const [formData, setFormData] = useState({
    // Drug_ATC fields
    guid: uuidv4(),
    code: "",
    levelName: "",
    levelNameAr: "",
    atcRelatedLabel: "",
    enabled: true,
    // Drug_ATCCodes fields
    guid: "",
    atcCode: "",
    levelName: "",
    levelNameAr: "",
    levelNumber: "",
    substanceName: "",
    atcIngredientName: "",
    atcIngredientNameAr: "",
    interactionIngredientName: "",
    enabled: true,
  });

  const [atcList, setAtcList] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get("/api/atc/v1.0");
        setAtcList(response.data);
      } catch (error) {
        console.error("Error fetching ATC data:", error);
        setError("Failed to fetch ATC data");
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Generate GUID for the new record in Drug_ATC table
      const atcGuid = uuidv4();
      // Perform API call to create a new record in Drug_ATC table
      await Axios.post("/api/atc/v1.0", {
        guid: atcGuid,
        code: formData.code,
        levelName: formData.levelName,
        levelNameAr: formData.levelNameAr,
        atcRelatedLabel: formData.atcRelatedLabel,
        enabled: formData.enabled,
      });

      // Perform API call to create a new record in Drug_ATCCodes table
      await Axios.post("/api/atccodes/v1.0", {
        guid: uuidv4(),
        code: formData.atcCode,
        atcGuid,
        levelName: formData.levelName,
        levelNameAr: formData.levelNameAr,
        levelNumber: formData.levelNumber,
        substanceName: formData.substanceName,
        atcIngredientName: formData.atcIngredientName,
        atcIngredientNameAr: formData.atcIngredientNameAr,
        interactionIngredientName: formData.interactionIngredientName,
        enabled: formData.enabled,
      });

      // Reset form fields after successful submission
      setFormData({
        code: "",
        atcCode: "",
        levelName: "",
        levelNameAr: "",
        levelNumber: 0,
        atcRelatedLabel: "",
        enabled: true,
        substanceName: "",
        atcIngredientName: "",
        atcIngredientNameAr: "",
        interactionIngredientName: "",
      });
      console.log("Form submitted successfully");
    } catch (error) {
      console.error("Error submitting form data:", error);
      setError("Failed to submit form data");
    }
  };

  return (
    <div className="flex flex-col max-w-lg mx-auto">
      <form
        className="grid grid-cols-2 gap-10 p-4 py-14 md:p-10"
        onSubmit={handleSubmit}
      >
        {/* Drug_ATC fields */}
        <div className="flex flex-col gap-6">
          <h3 className="text-green-pri">ATC</h3>
          <label className="flex flex-col">
            ATC:
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              required
              autoFocus
            />
          </label>

          <label className="flex flex-col">
            Level Name:
            <input
              type="text"
              name="levelName"
              value={formData.levelName}
              onChange={handleInputChange}
            />
          </label>

          <label className="flex flex-col">
            Level Name (Arabic):
            <input
              type="text"
              name="levelNameAr"
              value={formData.levelNameAr}
              onChange={handleInputChange}
            />
          </label>

          <label className="flex flex-col">
            ATC Related Label:
            <input
              type="text"
              name="atcRelatedLabel"
              value={formData.atcRelatedLabel}
              onChange={handleInputChange}
            />
          </label>
          {/* Add more Drug_ATC fields as needed */}
        </div>
        {/* /////////////////////////////////////////////////////////////////////////////////////// */}
        {/* /////////////////////////////////////////////////////////////////////////////////////// */}
        {/* /////////////////////////////////////////////////////////////////////////////////////// */}
        {/* Drug_ATCCodes fields */}
        <div className="flex flex-col gap-6">
          <h3 className="text-green-pri">ATC Codes</h3>
          <label className="flex flex-col">
            ATC Code:
            <input
              type="text"
              name="atcCode"
              value={formData.atcCode}
              onChange={handleInputChange}
              required
            />
          </label>

          <label className="flex flex-col">
            Substance Name:
            <input
              type="text"
              name="substanceName"
              value={formData.substanceName}
              onChange={handleInputChange}
            />
          </label>

          <label className="flex flex-col">
            ATC Ingredient Name:
            <input
              type="text"
              name="atcIngredientName"
              value={formData.atcIngredientName}
              onChange={handleInputChange}
            />
          </label>

          <label className="flex flex-col">
            ATC Ingredient Name (Arabic):
            <input
              type="text"
              name="atcIngredientNameAr"
              value={formData.atcIngredientNameAr}
              onChange={handleInputChange}
            />
          </label>

          <label className="flex flex-col">
            Interaction Ingredient Name:
            <input
              type="text"
              name="interactionIngredientName"
              value={formData.interactionIngredientName}
              onChange={handleInputChange}
            />
          </label>
          <label className="flex flex-col">
            Level Number:
            <input
              type="text"
              name="levelNumber"
              value={formData.levelNumber}
              onChange={handleInputChange}
            />
          </label>
          {/* Add more Drug_ATCCodes fields as needed */}
        </div>

        <button className="med-btn-pri col-span-full w-24" type="submit">
          Submit
        </button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default StaticData;
