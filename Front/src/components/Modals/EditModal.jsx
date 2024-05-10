/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prop-types */
// EditModal.js
import React, { useState, useEffect } from 'react';

const EditModal = ({ closeModal, title, onEdit, onCancel, initialValue }) => {
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleEdit = () => {
    console.log('Inside handleEdit');
    console.log('onEdit:', onEdit);
    onEdit({ originalValue: initialValue, updatedValue: inputValue });
    closeModal();
  };
  
  // const handleEdit = () => {
  //   onEdit({ originalValue: initialValue, updatedValue: inputValue });
  //   closeModal();
  // };

  const handleCancel = (e) => {
    e.preventDefault();
    onCancel();
    closeModal();
  };

  return (
    <div className="overlay fixed inset-0 flex items-center justify-center overflow-x-hidden overflow-y-auto z-50 dark:text-white ">
      <div className="relative bg-white-contents dark:bg-black-contents border border-[#00a65100] w-72 sm:w-96 rounded-xl p-4 shadow-lg dark:shadow-[#00000059]">
        <h2 className="text-lg font-medium mb-4">{title}</h2>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter value..."
          className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
        />

        <div className="flex justify-end pt-6 gap-4">
          <div
            className="med-btn-pri bg-green-pri dark:bg-green-pri hover:bg-transparent  dark:hover:bg-transparent text-white-text dark:text-white-text hover:text-green-sec font-bold border-2 border-green-sec hover:border-green-sec px-6 py-2 rounded-full cursor-pointer"
            onClick={handleEdit}
          >
            <span>Update</span>
          </div>

          <div
            className="med-btn-pri text-[#4edab9] font-bold border-2 border-green-sec hover:border-green-pri px-6 py-2 rounded-full cursor-pointer"
            onClick={handleCancel}
          >
            <span>Cancel</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
