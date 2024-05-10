import PropTypes from "prop-types";
import React, { useState } from "react";

import "./AddModalStyles.css";

const AddModal = ({ closeModal, title, onAdd, onCancel, initialValue }) => {
  const [inputValue, setInputValue] = useState(initialValue || "");

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleInputClick = (e) => {
    e.stopPropagation();
  };
  const handleAction = () => {
    const action = initialValue && inputValue !== "" ? "edit" : "add";
    if (action === "add") {
      onAdd(inputValue);
    } else {
      onAdd({ originalValue: initialValue, updatedValue: inputValue });
    }
    closeModal();
  };

  const handleCancel = (e) => {
    e.preventDefault(); // Prevent page refresh
    onCancel();
    closeModal(); // Close the modal here
  };

  return (
    <div className="overlay fixed inset-0 flex items-center justify-center overflow-x-hidden overflow-y-auto z-50 dark:text-white ">
      <div className="relative bg-white-contents dark:bg-black-contents border border-[#00a65100] w-72 sm:w-96 rounded-xl p-4 shadow-lg dark:shadow-[#00000059]">
        <label htmlFor="modalInput" className="mb-2 block text-lg">
          {title}
        </label>
        <input
          autoComplete="off"
          type="text"
          id="modalInput"
          onClick={handleInputClick}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
        />
        <div className="flex justify-end pt-6 gap-4">
          <button
            onClick={handleAction}
            className="med-btn-pri bg-green-pri dark:bg-green-pri hover:bg-transparent  dark:hover:bg-transparent text-white-text dark:text-white-text hover:text-green-sec font-bold border-2 border-green-sec hover:border-green-sec px-6 py-2 rounded-full cursor-pointer"
          >
            {initialValue ? "Edit" : "Add"}
          </button>
          <button
            className="med-btn-pri text-[#4edab9] font-bold border-2 border-green-sec hover:border-green-pri px-6 py-2 rounded-full cursor-pointer"
            onClick={handleCancel}
          >
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

AddModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddModal;
