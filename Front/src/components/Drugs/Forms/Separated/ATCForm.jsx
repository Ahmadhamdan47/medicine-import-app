import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import Axios from "../../../../api/axios";

const ATCForm = () => {
  const [formData, setFormData] = useState({
    guid: uuidv4(),
    code: "",
    levelName: "",
    levelNameAr: "",
    atcrelatedLabel: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios.post("/api/atc/v1.0", formData);
      // console.log(response.data);

      // Reset the form after successful submission
      setFormData({
        guid: uuidv4(),
        code: "",
        levelName: "",
        levelNameAr: "",
        atcrelatedLabel: "",
      });
    } catch (error) {
      console.error("Error:", error.response.data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 px-4 bg-white-contents dark:bg-black-contents rounded-2xl p-4 text-black-text dark:text-white-text">
      <h2 className="text-2xl font-semibold mb-4">Create New ATC Record</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="code" className="block mb-1">
            Code:
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full"
            required
            maxLength={3}
            autoComplete="off"
            autoFocus
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
          <label htmlFor="atcrelatedLabel" className="block mb-1">
            ATC Related Label:
          </label>
          <input
            type="text"
            name="atcrelatedLabel"
            value={formData.atcrelatedLabel}
            onChange={handleChange}
            className="w-full"
            required
            autoComplete="off"
          />
        </div>

        <button type="submit" className="med-btn-pri">
          Submit
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ATCForm;
