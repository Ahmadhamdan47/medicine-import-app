// Modal.js
import React from "react";

const CurrenciesTableCreateModal = ({
  isOpen,
  onClose,
  onSubmit,
  Guid,
  Code,
  Name,
  NameAr,
  onCodeChange,
  onNameChange,
  onNameArChange,
  mode,
}) => {
  const modalTitle = mode === "create" ? "Create New Entry" : `Edit "${Name}"`;

  return (
    <div
      className={`fixed inset-0 ${
        isOpen ? "" : "hidden"
      } flex items-center justify-center`}
    >
      <div
        className="modal-overlay absolute w-full h-full bg-gray-900 opacity750"
        onClick={onClose}
       />

      <div className="modal-container bg-white-contents dark:bg-black-input w-full mx-auto p-4 rounded shadow text-black-text dark:text-white-text">
        <div className="modal-content fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white-bg dark:bg-black-contents w-full md:w-[50%] py-4 text-left px-6 rounded-2xl">
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">{modalTitle}</h2>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="Code">
              Code
            </label>
            <input
              className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
              id="Code"
              type="text"
              placeholder=""
              autoComplete="off"
              value={Code}
              onChange={onCodeChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="Name">
              Name
            </label>
            <input
              className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
              id="Name"
              type="text"
              placeholder=""
              autoComplete="off"
              value={Name}
              onChange={onNameChange}
              //   disabled={mode === 'edit'} // Disable input in edit mode
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="Agent">
              Name ar
            </label>
            <input
              className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
              id="NameAr"
              type="text"
              placeholder=""
              autoComplete="off"
              value={NameAr}
              onChange={onNameArChange}
              //   disabled={mode === 'edit'} // Disable input in edit mode
            />
          </div>
          <div className="flex justify-end">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 ml-2"
              onClick={onSubmit}
            >
              {mode === "create" ? "Create" : "Save"}
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 ml-2"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrenciesTableCreateModal;