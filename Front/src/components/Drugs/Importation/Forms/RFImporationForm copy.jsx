import React, { useState } from "react";

import "../styles.css";

const RFImportationForm = ({ handleInputChange, rfiFormData }) => {
  const [isInputsEnabled, setIsInputsEnabled] = useState(false);

  const handleCheckboxChange = () => {
    setIsInputsEnabled(!isInputsEnabled);
  };

  return (
    <div className="col-span-1 flex w-full sm:w-[70em] flex-col sm:col-span-1 text-black-text dark:text-white-text">
        <div className="flex flex-col justify-items-center">
          <h1 className="pt-6 text-center text-[1.375rem] xs:text-xl sm:py-10 font-medium">
            1 - Request For importation
          </h1>
        </div>
        <div className=" flex h-full w-full flex-col">
          <div
            onSubmit={(e) => e.preventDefault()}
            className="grid grid-cols-1 items-center gap-8 lg:gap-16 dark:text-white-text sm:grid-cols-1 sm:justify-items-center md:grid-cols-2 lg:grid-cols-2 py-16"
          >
            <div className="input-container relative">
              <label
                htmlFor="RequestedDrug"
                className="labels text-lg block text-left font-medium"
              >
                Requested Drug
              </label>
              <input
                value={rfiFormData.RequestedDrug}
                onChange={(e) =>
                  handleInputChange("RequestedDrug", e.target.value)
                }
                autoFocus
                className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
                type="text"
                placeholder="drug name"
              />
            </div>
            <div className="input-container relative">
              <label
                htmlFor="quantityRequested"
                className="labels text-lg block text-left font-medium"
              >
                Quantity Requested
              </label>
              <input
                value={rfiFormData.quantityRequested}
                onChange={(e) =>
                  handleInputChange("quantityRequested", e.target.value)
                }
                className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
                type="text"
                placeholder="qty"
              />
            </div>

            <div className="flex flex-col mt-6">
              <div className="checkbox-container flex items-center gap-2 w-fit text-left mb-1 pl-2">
                <input
                  type="checkbox"
                  id="enableInputs"
                  checked={isInputsEnabled}
                  onChange={handleCheckboxChange}
                />
                <label
                  htmlFor="enableInputs"
                  className="labels text-lg block text-left font-medium"
                >
                  Add Offer
                </label>
              </div>

              <div
                className={`offer-container mt-1 h-24 w-full flex justify-center items-center gap-12 sm:gap-10 md:gap-4 lg:gap-10 xl:gap-10 px-14 md:px-8 lg:px-10 rounded-full ${
                  isInputsEnabled
                    ? "bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
                    : "bg-[#C0C0C0] dark:bg-black-bg px-4 py-2 font-normal shadow-md dark:shadow-black-shadow"
                } `}
              >
                <div
                  className={`col-1 flex flex-col w-[6em] xs:w-[14em] border-b-2 border-[#00a65159] ${
                    isInputsEnabled
                      ? "border-b-2 border-[#00a65159] hover:border-green-pri"
                      : "border-b-2 border-[#08251642]"
                  } `}
                >
                  <label htmlFor="offerType" className="labels text-md block">
                    Type
                  </label>
                  <select
                    value={rfiFormData.offerType}
                    onChange={(e) =>
                      handleInputChange("offerType", e.target.value)
                    }
                    disabled={!isInputsEnabled}
                    className={`type-input mt-1  w-full flex justify-center items-center gap-4 xl:gap-10 sm:px-6 rounded-full outline-none focus:outline-none focus:ring-2 focus:ring-transparent dark:focus:ring-2 ${
                      isInputsEnabled
                        ? "bg-white-bg dark:bg-black-input border-none"
                        : "bg-[#C0C0C0] dark:bg-black-bg border-none"
                    } `}
                    type="text"
                    placeholder=""
                  >
                    <option value="" disabled>
                      select
                    </option>
                    <option>type 1</option>
                    <option>type 2</option>
                    <option>type 3</option>
                  </select>
                </div>

                <div
                  className={`col-1 flex flex-col w-[6em] xs:w-[14em] border-b-2 border-[#00a65159] ${
                    isInputsEnabled
                      ? "border-b-2 border-[#00a65159] hover:border-green-pri"
                      : "border-b-2 border-[#08251642]"
                  } `}
                >
                  <label
                    htmlFor="offerPercentage"
                    className="labels text-md block"
                  >
                    Percentage
                  </label>
                  <select
                    value={rfiFormData.offerPercentage}
                    onChange={(e) =>
                      handleInputChange("offerPercentage", e.target.value)
                    }
                    disabled={!isInputsEnabled}
                    className={`percentage-input mt-1  w-full flex justify-center items-center gap-4 xl:gap-10 sm:px-6 rounded-full outline-none focus:outline-none focus:ring-2 focus:ring-transparent dark:focus:ring-2 ${
                      isInputsEnabled
                        ? "bg-white-bg dark:bg-black-input border-none"
                        : "bg-[#C0C0C0] dark:bg-black-bg border-none"
                    } `}
                    type="text"
                    placeholder="%"
                  >
                    <option value="" disabled>
                      select
                    </option>
                    <option>5%</option>
                    <option>10%</option>
                    <option>20%</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="input-container relative md:mt-[2rem]">
              <label
                htmlFor="notes"
                className="labels text-lg block text-left font-medium"
              >
                Notes
              </label>
              <textarea
                value={rfiFormData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="mt-1 w-full h-24 rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-6 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
                type="text"
                placeholder=""
              />
            </div>
          </div>
        </div>
      </div>
  );
};

export default RFImportationForm;
