/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';

import { useInspection } from '../../pages/Inspection/InspectionContext';

const BatchSerials = ({ onClose }) => {
  const { handleSubmit } = useInspection();

  const [numSerials, setNumSerials] = useState(1);
  const [serialValues, setSerialValues] = useState(Array(numSerials).fill(''));

  const handleInputChange = (index, event) => {
    const values = [...serialValues];
    values[index] = event.target.value;
    setSerialValues(values);
  };

  const handleNumSerialsChange = (event) => {
    let newNumSerials = parseInt(event.target.value);
    if (isNaN(newNumSerials)) newNumSerials = 0;
    setNumSerials(newNumSerials);
    setSerialValues(Array(newNumSerials).fill(''));
  };

  const handleAdd = () => {
    // Define the onAddSerials function logic here or pass it as a prop from a parent component
    console.log('Add serials:', serialValues);
    onClose();
  };

  const handlePaste = () => {
    navigator.clipboard.readText().then((text) => {
      const serials = text.split(/\n|\s+/).filter((serial) => serial.trim() !== '');
      if (serials.length <= numSerials) {
        setSerialValues(serials);
      } else {
        setSerialValues(serials.slice(0, numSerials));
      }
    });
  };

  return (
    <div className="modal fixed w-full h-screen top-0 left-0  dark:text-white-text z-50 p-4 py-1">
      <form
        onSubmit={handleSubmit}
        className="modal-container bg-white-contents dark:bg-black-contents rounded-3xl shadow-lg z-50 overflow-y-auto h-full relative flex flex-col"
      >
        <div className="modal-header flex flex-col h-32 text-center px-6 sticky top-0 z-50 bg-white-input dark:bg-black-fg">
          <div className="flex justify-end items-center pt-4 mb-[-1rem]">
            <CloseIcon onClick={onClose} fontSize="small cursor-pointer z-50" />
          </div>
          <div>
            <div className="mb-4">
              <label className="block text-lg md:text-xl">Count of Serials Numbers</label>
              <div className="flex justify-center items-center">
                <button
                  type="button"
                  className="bg-gray-300 dark:bg-black-contents text-green-pri dark:text-green-pri w-8 h-8 rounded-full"
                  onClick={() => setNumSerials((prevNum) => Math.max(0, prevNum - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  value={numSerials}
                  onChange={handleNumSerialsChange}
                  className="input-field w-16 text-center border text-[#00a651] font-bold focus:ring-transparent outline-none p-2 bg-white-bg dark:bg-transparent rounded-full autofill:bg-transparent mx-2"
                />
                <button
                  type="button"
                  className="bg-gray-300 dark:bg-black-contents text-green-pri dark:text-green-pri w-8 h-8 rounded-full"
                  onClick={() => setNumSerials((prevNum) => prevNum + 1)}
                >
                  +
                </button>
              </div>
              <div className="flex justify-end gap-6 lg:pr-20 mt-[-2rem]">
                <button className="med-btn-sec-sm bg-green-pri" type="button" onClick={handlePaste}>
                  Paste All
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-contents h-full py-10 text-left px-6 flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: numSerials }, (_, index) => (
              <div key={index} className="mb-4">
                <label className="block text-lg mb-2">Serial {index + 1}:</label>
                <input
                  type="text"
                  value={serialValues[index] ?? ''}
                  onChange={(event) => handleInputChange(index, event)}
                  className={`mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri ${
                    serialValues[index]?.trim() ? 'highlight' : ''
                  } ${
                    serialValues[index]?.trim()
                      ? 'bg-yellow-light dark:bg-yellow-light dark:text-black-text'
                      : ''
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <div className="sticky inset-x-0 bottom-0 pb-2 bg-white-contents dark:bg-black-contents">
            <button type="button" className="med-btn-3rd" onClick={handleAdd}>
              Add Serials
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BatchSerials;
