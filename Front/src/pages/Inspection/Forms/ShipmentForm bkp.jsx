import React, { useState } from "react";

const BatchComponent = ({ label, inputs, onAddSerials }) => (
  <div className="flex flex-col">
    <label
      htmlFor={inputs[0].id}
      className="labels text-[1.375rem] font-medium pl-6 mb-4 text-left"
    >
      {label}
    </label>
    <div className=" dark:text-white-text rounded-[5em] sm:rounded-[6em] border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 lg:px-4 py-4 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri">
      <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-6 px-4 items-center">
        {inputs.map((input, index) => (
          <div
            key={index}
            className="mb-4 text-center border-b border-[#00a651] text-white"
          >
            <label
              htmlFor={input.id}
              className="labels text-lg block text-center"
            >
              {input.label}
            </label>
            <input
              id={input.id}
              name={input.name}
              className="w-full pl-6 sm:pl-0 input-field border-none text-[#00a651] font-bold focus:ring-transparent outline-none p-2 bg-white-bg dark:bg-black-input rounded-full"
              type={input.type}
              autoComplete="off"
            />
          </div>
        ))}
        <div className="mb-4 flex flex-col mx-auto text-center w-fit items-center text-white gap-2">
          <span className="text-[10px]">Batch Serial Numbers</span>
          <button className="med-btn-pri-sm w-32" onClick={onAddSerials}>
            Add Serials
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////

const ShipmentForm = () => {
  const [batchesQty, setBatchesQty] = useState(0);

  const handleIncrement = () => {
    if (batchesQty < 10) {
      setBatchesQty((prevQty) => prevQty + 1);
    }
  };

  const handleDecrement = () => {
    setBatchesQty((prevQty) => Math.max(0, prevQty - 1));
  };

  const handleBatchesQtyChange = (e) => {
    let qty = parseInt(e.target.value, 10) || 0;
    qty = Math.min(qty, 10); // Limit to maximum of 10
    setBatchesQty(qty);
  };

  const renderBatches = () => {
    const batches = [];
    for (let i = 1; i <= batchesQty; i++) {
      batches.push(
        <BatchComponent
          key={i}
          label={`Batch ${i}`}
          inputs={[
            {
              id: `batchNumber-${i}`,
              name: `batchNumber-${i}`,
              label: "Batch Number",
              type: "text",
            },
            {
              id: `batchProductionDate-${i}`,
              name: `batchProductionDate-${i}`,
              label: "Production Date",
              type: "date",
            },
            {
              id: `batchExpiryDate-${i}`,
              name: `batchExpiryDate-${i}`,
              label: "Expiry Date",
              type: "date",
            },
          ]}
        />
      );
    }
    return batches;
  };

  return (
    <div className="grid grid-cols-1 w-3/4 gap-10 text-black-text dark:text-white-text">
      {/* Existing sections */}

      {/* BARCODE SECTION */}
      <div className="flex flex-col">
        {/* Existing Barcode section */}

        <div className=" dark:text-white-text rounded-[5em] sm:rounded-[6em] border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-bg px-4 lg:px-4 py-4 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri">
          <div className="w-full grid grid-cols-2 gap-8 px-4 items-center">
            {/* Column 1 */}
            <div className="mb-4 text-center border-b border-[#00a651] text-white">
              <label
                htmlFor="batchBarcode"
                className="labels text-lg block text-center"
              >
                Barcode Number
              </label>
              <input
                id="batchBarcode"
                name="batchBarcode"
                className="input-field border-none text-[#00a651] font-bold focus:ring-transparent outline-none p-2 bg-white-bg dark:bg-transparent rounded-full autofill:bg-transparent"
                type="number"
                autoComplete="off"
              />
            </div>

            {/* Column 2 */}
            <div className="mb-4 text-center border-b border-[#00a651] text-white">
              <label
                htmlFor="batchesQty"
                className="labels text-lg block text-center"
              >
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
                  value={batchesQty}
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

      {/* Render Batch Components */}
      {batchesQty > 0 && renderBatches()}
    </div>
  );
};

export default ShipmentForm;
