import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import Axios from "../../../../api/axios";


const ATCForm = ({ formData, onChange, onSubmit }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  const handleATCFormSubmit = async (e) => {
    e.preventDefault();

    try {
      Axios.post("/api/atc/v1.0")
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error("ATC Form Submit Error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 px-4 bg-white-contents dark:bg-black-contents rounded-2xl p-4 text-black-text dark:text-white-text">
      <h2 className="text-2xl font-semibold mb-4">Create New ATC Record</h2>

      <div className="mb-4">
        <label htmlFor="code" className="block mb-1">
          Code:
        </label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          className="w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
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
          className="w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
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
          className="w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
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
          className="w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
          required
          autoComplete="off"
        />
        <button className="med-btn-pri" onClick={handleATCFormSubmit} type="submit">
          Submit
        </button>
      </div>
    </div>
  );
};

const ATCCodesForm = ({ formData, onChange, onSubmit }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  return (
    <div className="max-w-md mx-auto mt-8 px-4 bg-white-contents dark:bg-black-contents rounded-2xl p-4 text-black-text dark:text-white-text">
      <h2 className="text-2xl font-semibold mb-4">Create New ATC Code</h2>

      <div className="mb-4">
        <label htmlFor="code" className="block mb-1">
          ATC Code:
        </label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          className="w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
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
          className="w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
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
          className="w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
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
          className="w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
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
          className="w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
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
          className="w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
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
          className="w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
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
          className="w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
          required
          autoComplete="off"
        />
      </div>

      <button type="submit" className="med-btn-pri" onClick={onSubmit}>
        Submit ATC Codes Form
      </button>
    </div>
  );
};

const ParentComponent = () => {
  const [atcFormData, setATCFormData] = useState({
    guid: uuidv4(),
    code: "",
    levelName: "",
    levelNameAr: "",
    atcrelatedLabel: "",
    // enabled: true,
  });

  //   const handleATCFormSubmit = async (e) => {
  //     e.preventDefault();

  //     try {
  //       Axios.post("/api/atc/v1.0")
  //         .then((response) => {
  //           console.log(response.data);
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     } catch (error) {
  //       console.error("ATC Form Submit Error:", error);
  //     }
  //   };

  const handleATCCodesFormSubmit = async (e) => {
    e.preventDefault();

    try {
      Axios.post("/api/atccodes/v1.0")
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error("ATC Form Submit Error:", error);
    }
  };

  return (
    <div>
      <ATCForm
        formData={atcFormData}
        onChange={setATCFormData}
        // onSubmit={handleATCFormSubmit}
      />

      <ATCCodesForm
        formData={atcFormData}
        onChange={setATCFormData}
        onSubmit={handleATCCodesFormSubmit}
      />
      <ToastContainer />
    </div>
  );
};

export default ParentComponent;
