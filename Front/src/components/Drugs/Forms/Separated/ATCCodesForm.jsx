import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import Axios from "../../../../api/axios";

const ATCCodesForm = ({ atcGuid }) => {
  const [formData, setFormData] = useState({
    guid: uuidv4(),
    atcGuid: "", 
    code: "",
    levelName: "",
    levelNameAr: "",
    levelNumber: 0,
    substanceName: "",
    atcingredientName: "",
    atcingredientNameAr: "",
    interactionIngredientName: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios.post("/api/atccodes/v1.0", formData);
      console.log(response.data);

      // Reset the form after successful submission
      setFormData({
        guid: uuidv4(),
        atcGuid,
        code: "",
        levelName: "",
        levelNameAr: "",
        levelNumber: "",
        substanceName: "",
        atcingredientName: "",
        atcingredientNameAr: "",
        interactionIngredientName: "",
      });
    } catch (error) {
      console.error("Error:", error.response.data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Create New ATC Code</h2>

      <div className="mb-4">
        <label htmlFor="code" className="block mb-1">
          Code:
        </label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          className="w-full "
          required
          maxLength={3}
          autoComplete="off"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="levelName" className="block mb-1">
          Level Name:
        </label>
        <input
          type="text"
          name="levelName"
          value={formData.levelName}
          onChange={handleChange}
          className="w-full"
          required
          autoComplete="off"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="levelNameAr" className="block mb-1">
          Level Name Arabic:
        </label>
        <input
          type="text"
          name="levelNameAr"
          value={formData.levelNameAr}
          onChange={handleChange}
          className="w-full"
          required
          autoComplete="off"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="levelNumber" className="block mb-1">
          Level Number:
        </label>
        <input
          type="number"
          name="levelNumber"
          value={formData.levelNumber}
          onChange={handleChange}
          className="w-full"
          required
          autoComplete="off"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="substanceName" className="block mb-1">
          Substance Name:
        </label>
        <input
          type="text"
          name="substanceName"
          value={formData.substanceName}
          onChange={handleChange}
          className="w-full"
          required
          autoComplete="off"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="atcingredientName" className="block mb-1">
          ATC Ingredient Name:
        </label>
        <input
          type="text"
          name="atcingredientName"
          value={formData.atcingredientName}
          onChange={handleChange}
          className="w-full"
          required
          autoComplete="off"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="atcingredientNameAr" className="block mb-1">
          ATC Ingredient Name Arabic:
        </label>
        <input
          type="text"
          name="atcingredientNameAr"
          value={formData.atcingredientNameAr}
          onChange={handleChange}
          className="w-full"
          required
          autoComplete="off"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="interactionIngredientName" className="block mb-1">
          Interaction Ingredient Name:
        </label>
        <input
          type="text"
          name="interactionIngredientName"
          value={formData.interactionIngredientName}
          onChange={handleChange}
          className="w-full"
          required
          autoComplete="off"
        />
      </div>
      <button onClick={handleSubmit} className="med-btn-pri" type="submit">
        Submit
      </button>
      <ToastContainer />
    </div>
  );
};

export default ATCCodesForm;
