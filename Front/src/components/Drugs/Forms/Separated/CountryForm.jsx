import axios from "axios";
import * as yup from 'yup';
import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

const CountryForm = () => {
  const [formData, setFormData] = useState({
    guid: "",
    code: "",
    name: "",
    nameAr: "",
    enabled: true,
    createdDate: new Date().toISOString(),
    isNearByCountry: true,
    isReferenceCountry: true,
    isComparative: true,
  });

  const schema = yup.object().shape({
    code: yup.string().required("Code is required"),
    name: yup.string().required("Name is required"),
    nameAr: yup
      .string()
      .matches(
        /^[\u0621-\u064A\s]*$/,
        "Please use Arabic letters (أ ب ت) for the Name (Arabic)"
      )
      .required("Name (Arabic) is required"),
    // Add other validations for your form fields
    isNearByCountry: yup.boolean().required("Please select Is Near By Country"),
    isReferenceCountry: yup
      .boolean()
      .required("Please select Is Reference Country"),
    isComparative: yup.boolean().required("Please select Is Comparative"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate form data against the schema
      await schema.validate(formData, { abortEarly: false });

      const newGuid = uuidv4();
      const currentDate = new Date().toISOString();

      const response = await axios.post(
        "http://1.1.1.250:3500/api/country/v1.0",
        { ...formData, guid: newGuid, createdDate: currentDate }
      );

      console.log("Country data submitted successfully:", response.data);

      setFormData({
        guid: "",
        code: "",
        name: "",
        nameAr: "",
        enabled: true,
        createdDate: currentDate,
        isNearByCountry: true,
        isReferenceCountry: true,
        isComparative: true,
      });

      toast.success("Country data submitted successfully.");
    } catch (error) {
      // Check if the error is a validation error
      if (error.name === "ValidationError") {
        // Display validation errors using toast
        error.errors.forEach((validationError) => {
          toast.error(validationError);
        });
      } else {
        console.error("Error submitting country data:", error.message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-4 bg-gray-100 shadow-md rounded-md"
      >
        <label className="block mb-2">
          Code:
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
          />
        </label>

        <label className="block mb-2">
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
          />
        </label>

        <label className="block mb-2">
          Name Ar:
          <input
            type="text"
            name="nameAr"
            value={formData.nameAr}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
          />
        </label>

        <label className="block mb-2">
          Is Near By Country:
          <input
            type="checkbox"
            name="isNearByCountry"
            checked={formData.isNearByCountry}
            onChange={handleChange}
          />
        </label>

        <label className="block mb-2">
          Is Reference Country:
          <input
            type="checkbox"
            name="isReferenceCountry"
            checked={formData.isReferenceCountry}
            onChange={handleChange}
          />
        </label>

        <label className="block mb-2">
          Is Comparative:
          <input
            type="checkbox"
            name="isComparative"
            checked={formData.isComparative}
            onChange={handleChange}
          />
        </label>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
        >
          Submit
        </button>
      </form>

      {/* Toast container for displaying messages */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CountryForm;
