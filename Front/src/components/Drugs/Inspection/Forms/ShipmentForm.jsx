/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";

import BatchSerials from "../../../../components/Modals/BatchSerials";

const BatchComponent = ({ label, inputs, onAddSerials, onInputChange }) => {
  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index].value = value;
    console.log("New inputs:", newInputs);
    onInputChange(newInputs);
    console.log("BatchComponent inputs:", newInputs);
  };

  return (
    <div className="flex flex-col">
      <label
        htmlFor={inputs[0].id}
        className="labels text-[1.375rem] font-medium pl-6 mb-4 text-left"
      >
        {label}
      </label>
      <div className="dark:text-white-text rounded-[5em] sm:rounded-[6em] border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 lg:px-4 py-4 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri">
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-6 px-4 items-center">
          {inputs.map((input, index) => (
            <div
              key={index}
              className="mb-4 text-center border-b border-[#00a651] text-white"
            >
              <label htmlFor={input.id} className="labels block text-center">
                {input.label}
              </label>
              <input
                id={input.id}
                name={input.name}
                className="w-full pl-6 sm:pl-0 input-field border-none text-[#00a651] font-bold focus:ring-transparent outline-none p-2 bg-white-bg dark:bg-black-input rounded-full"
                type={input.type}
                autoComplete="off"
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            </div>
          ))}
          <div className="mb-4 flex flex-col mx-auto text-center w-fit items-center text-white gap-2">
            <span>Batch Serial Numbers</span>
            <button className="med-btn-pri-sm w-32" onClick={onAddSerials}>
              Add Serials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShipmentForm = ({
  formData,
  onFormChange,
  batchesQty,
  onBatchesQtyChange,
  batchComponents,
  onBatchComponentChange,
}) => {
  const [localBatchesQty, setLocalBatchesQty] = useState(batchesQty);
  const [selectedBatchIndex, setSelectedBatchIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setLocalBatchesQty(batchesQty);
  }, [batchesQty]);

  const handleIncrement = () => {
    if (localBatchesQty < 10) {
      setLocalBatchesQty(localBatchesQty + 1);
      onBatchesQtyChange(localBatchesQty + 1);
    }
  };

  const handleDecrement = () => {
    if (localBatchesQty > 0) {
      setLocalBatchesQty(localBatchesQty - 1);
      onBatchesQtyChange(localBatchesQty - 1);
    }
  };

  const handleBatchesQtyChange = (e) => {
    let qty = parseInt(e.target.value, 10) || 0;
    qty = Math.min(qty, 10);
    setLocalBatchesQty(qty);
    onBatchesQtyChange(qty);
  };

  const handleOpenModal = (index) => {
    setSelectedBatchIndex(index);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddSerials = (serialValues) => {
    const updatedBatchComponents = [...batchComponents];
    updatedBatchComponents[selectedBatchIndex].serialNumbers = serialValues;
    onBatchComponentChange(
      selectedBatchIndex,
      updatedBatchComponents[selectedBatchIndex]
    );
    handleCloseModal();

    // Pass serialValues to the Inspection component
    onFormChange({ batchSerials: serialValues });
  };

  const renderBatches = () => Array.from({ length: localBatchesQty }, (_, index) => (
      <div key={index}>
        <BatchComponent
          label={`Batch ${index + 1}`}
          inputs={[
            {
              id: `batchNumber-${index}`,
              name: `batchNumber-${index}`,
              label: "Batch Number",
              type: "text",
              value: batchComponents[index]?.batchNumber || "",
            },
            {
              id: `batchProductionDate-${index}`,
              name: `batchProductionDate-${index}`,
              label: "Production Date",
              type: "date",
              value: batchComponents[index]?.batchProductionDate || "",
            },
            {
              id: `batchExpiryDate-${index}`,
              name: `batchExpiryDate-${index}`,
              label: "Expiry Date",
              type: "date",
              value: batchComponents[index]?.batchExpiryDate || "",
            },
          ]}
          onAddSerials={() => handleOpenModal(index)}
          onInputChange={(newData) => onBatchComponentChange(index, newData)}
        />
      </div>
    ));

  return (
    <div className="grid grid-cols-1 w-full lg:w-3/4 gap-10 text-black-text dark:text-white-text">
      <div className="flex flex-col w-full">
        <h1 className="title">Shipment</h1>
        <div className="dark:text-white-text rounded-[5em] sm:rounded-[6em] border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 lg:px-4 py-4 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri">
          <div className="w-full grid grid-cols-2 gap-8 px-2 md:px-4 items-center">
            <div className="mb-4 text-center border-b border-[#00a651] text-white">
              <label
                htmlFor="batchBarcode"
                className="labels block text-center"
              >
                GTIN Number
              </label>
              <input
                id="batchBarcode"
                name="batchBarcode"
                className="input-field w-20 sm:w-full border-none text-[#00a651] font-bold focus:ring-transparent outline-none p-2 bg-white-bg dark:bg-transparent rounded-full autofill:bg-transparent"
                type="number"
                autoComplete="off"
                value={formData.batchBarcode || ""}
                onChange={(e) =>
                  onFormChange({ ...formData, batchBarcode: e.target.value })
                }
              />
            </div>

            <div className="mb-4 text-center border-b border-[#00a651] text-white">
              <label htmlFor="batchesQty" className="labels block text-center">
                Batches Quantity
              </label>
              <div className="flex justify-center items-center">
                <button
                  className="bg-gray-300 dark:bg-black-contents text-gray-600 dark:text-green-pri w-8 h-8 rounded-full"
                  type="button"
                  onClick={handleDecrement}
                >
                  -
                </button>
                <input
                  id="batchesQty"
                  name="batchesQty"
                  className="input-field text-center border-none text-[#00a651] font-bold focus:ring-transparent outline-none p-2 bg-white-bg dark:bg-transparent rounded-full autofill:bg-transparent"
                  type="number"
                  min="0"
                  max="10"
                  value={localBatchesQty}
                  onChange={handleBatchesQtyChange}
                  autoComplete="off"
                />
                <button
                  className="bg-gray-300 dark:bg-black-contents text-gray-600 dark:text-green-pri w-8 h-8 rounded-full"
                  type="button"
                  onClick={handleIncrement}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {localBatchesQty > 0 && renderBatches()}

      {showModal && (
        <BatchSerials
          onClose={handleCloseModal}
          onAddSerials={handleAddSerials}
        />
      )}
    </div>
  );
};

export default ShipmentForm;
