/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from "react";

const ImportationProcessForm = ({
  handleInputChange,
  importProcessPFIData,
  importProcessSWIFTData,
  isFormSubmitted,
  currentStep,
}) => {
  const [uploadedPFI, setUploadedPFI] = useState(false);
  const [uploadedSwift, setUploadedSwift] = useState(false);

  const handlePFIDocChange = (e) => {
    const selectedFile = e.target.files[0];

    handleInputChange("PFIdoc", selectedFile);

    setUploadedPFI(!!selectedFile);
  };

  const handlePFISubmit = (e) => {
    e.preventDefault();

    if (currentStep === 1) {
      console.log("Submitting PFI data:", importProcessPFIData);
    }
  };

  const handleSWIFTSubmit = (e) => {
    e.preventDefault();
    if (currentStep === 1) {
      console.log("Submitting SWIFT data:", importProcessSWIFTData);
    }
  };

  const handleSWIFTDocChange = (e) => {
    const selectedFile = e.target.files[0];

    handleInputChange("SWIFTdoc", selectedFile);

    setUploadedSwift(!!selectedFile);
  };

  useEffect(() => {
    console.log("isFormSubmitted for ImportationProcessForm:", isFormSubmitted);
  }, [isFormSubmitted]);

  return (
    <div className="grid grid-cols-1 w-full  gap-10 text-black-text dark:text-white-text">
      {/* RESULT SECTION */}
      <h1 className="pt-6 text-center text-[1.375rem] xs:text-xl sm:pt-8 font-medium">
        2 - Importation Process
      </h1>
      <div className="flex flex-col">
        <label
          htmlFor="PFInumber"
          className="labels text-[1.375rem] font-medium pl-6 mb-4 text-left"
        >
          Result
        </label>
        <div className=" dark:text-white-text rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-bg sm:px-6 py-4 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri">
          <div className="grid grid-cols-3 gap-10 md:gap-32 px-4 sm:px-10 items-center">
            {/* Column 1 */}
            <div className="mb-4 text-center border-b border-black-fg">
              <p className=" text-white text-lg pb-2">Status</p>
              <p className="text-green-pri font-bold">Approved</p>
            </div>

            {/* Column 2 */}
            <div className=" mb-4 text-center border-b border-black-fg">
              <p className="text-white text-lg pb-2">QTY Approved</p>
              <p className="text-green-pri font-bold">100</p>
            </div>
            <div className=" mb-4 text-center border-b border-black-fg">
              <p className="text-white text-lg pb-2">Offer</p>
              <p className="text-green-pri font-bold">100</p>
            </div>
          </div>
        </div>
      </div>

      {/* /////////////////////////////////////////////////////////////////////////// */}

      {/* PFI SECTION */}
      <div className="flex flex-col">
        <label
          htmlFor="PFInumber"
          className="labels text-[1.375rem] font-medium pl-6 mb-4 text-left"
        >
          Proforma Invoice
        </label>
        <div className=" dark:text-white-text rounded-[5em] sm:rounded-[6em] border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-4 font-normal shadow-md dark:shadow-black-shadow">
          <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-10 px-4  items-center">
            {/* Column 1 */}
            <div className="mb-4 text-center border-b border-[#00a651] text-white">
              <label
                htmlFor="PFInumber"
                className="labels text-lg block text-center"
              >
                Number
              </label>
              <input
                id="PFInumber"
                name="PFInumber"
                onChange={(e) => handleInputChange("PFInumber", e.target.value)}
                value={importProcessPFIData.PFInumber || ""}
                className="w-3/4 sm:w-full input-field mx-auto border-none text-[#00a651] font-bold focus:ring-transparent outline-none p-2 bg-white-bg dark:bg-black-input rounded-full"
                type="text"
                autoComplete="off"
              />
            </div>

            {/* Column 2 */}
            <div className="mb-4 text-center border-b border-[#00a651] text-white">
              <label
                htmlFor="PFIdate"
                className="labels text-lg block text-center"
              >
                Date
              </label>
              <input
                id="PFIdate"
                name="PFIdate"
                onChange={(e) => handleInputChange("PFIdate", e.target.value)}
                value={importProcessPFIData.PFIdate || ""}
                // value={PFIdate}
                className="w-full pl-6 sm:pl-0 input-field border-none text-[#00a651] font-bold focus:ring-transparent outline-none p-2 bg-white-bg dark:bg-black-input rounded-full"
                type="date"
                autoComplete="off"
              />
            </div>

            {/* Column 3 */}
            <div className="mb-4 text-center border-b border-[#00a651] text-white">
              <label
                htmlFor="PFIamount"
                className="labels text-lg block text-center"
              >
                Amount
              </label>
              <input
                id="PFIamount"
                name="PFIamount"
                value={importProcessPFIData.PFIamount || ""}
                onChange={(e) => handleInputChange("PFIamount", e.target.value)}
                className=" w-3/4 sm:w-full input-field border-none text-[#00a651] font-bold focus:ring-transparent outline-none p-2 bg-white-bg dark:bg-black-input rounded-full autofill:bg-transparent"
                type="text"
                autoComplete="off"
              />
            </div>

            {/* Column 4 */}
            <div className="mx-auto gap-4 flex flex-col sn:flex-row">
              {uploadedPFI ? (
                <div
                  className="med-btn-pri hover:text-white-text font-bold border-2 border-green-sec  hover:border-green-pri px-6 py-4 rounded-full cursor-pointer"
                  onClick={() => setUploadedPFI(false)}
                >
                  Uploaded
                  <span className="ml-1">✔</span>
                </div>
              ) : (
                <label className="med-btn-pri border-2 border-green-pri py-3 text-[#00a651] font-bold dark:bg-black-input rounded-full cursor-pointer">
                  <span className=" hover:text-white-text w-full py-4">
                    Attach
                  </span>
                  <input
                    type="file"
                    id="attach"
                    className="hidden"
                    onChange={handlePFIDocChange}
                  />
                </label>
              )}
              <button className="med-btn-sec" onClick={handlePFISubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ///////////////////////////////////////////////////////// */}

      {/* SWIFT SECTION */}
      <div className="flex flex-col">
        <label
          htmlFor="swiftNumber"
          className="labels text-[1.375rem] font-medium pl-6 mb-4 text-left"
        >
          Swift
        </label>

        <div className=" dark:text-white-text rounded-[5em] sm:rounded-[6em] border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 lg:px-4 py-4 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri">
          <div className="w-full grid grid-cols-2 lg:grid-cols-5 gap-6 px-4 items-center">
            {/* Column 1 */}
            <div className="mb-4 text-center border-b border-[#00a651] text-white">
              <label
                htmlFor="bankName"
                className="labels text-lg block text-center"
              >
                Bank
              </label>
              <select
                id="bankName"
                name="bankName"
                value={importProcessSWIFTData?.bankName}
                onChange={(e) => handleInputChange("bankName", e.target.value)}
                className=" w-3/4 sm:w-full input-field border-none text-[#00a651] font-bold focus:ring-transparent outline-none p-2 bg-white-bg dark:bg-black-input rounded-full autofill:bg-transparent"
                type="text"
                autoComplete="off"
              >
                <option value="" disabled>
                  select
                </option>
                <option>Bank bemo</option>
                <option>Byblos bank</option>
                <option>Audi bank</option>
              </select>
            </div>

            <div className="mb-4 text-center border-b border-[#00a651] text-white">
              <label
                htmlFor="swiftNumber"
                className="labels text-lg block text-center"
              >
                Number
              </label>
              <input
                id="swiftNumber"
                name="swiftNumber"
                onChange={(e) =>
                  handleInputChange("swiftNumber", e.target.value)
                }
                value={importProcessSWIFTData?.swiftNumber}
                className="w-3/4 sm:w-full input-field mx-auto border-none text-[#00a651] font-bold focus:ring-transparent outline-none p-2 bg-white-bg dark:bg-black-input rounded-full"
                type="text"
                autoComplete="off"
              />
            </div>

            {/* Column 2 */}
            <div className="mb-4 text-center border-b border-[#00a651] text-white">
              <label
                htmlFor="swiftDate"
                className="labels text-lg block text-center"
              >
                Date
              </label>
              <input
                id="swiftDate"
                name="swiftDate"
                onChange={(e) => handleInputChange("swiftDate", e.target.value)}
                value={importProcessSWIFTData?.swiftDate}
                className="w-full pl-6 sm:pl-0 input-field border-none text-[#00a651] font-bold focus:ring-transparent outline-none p-2 bg-white-bg dark:bg-black-input rounded-full"
                type="date"
                autoComplete="off"
              />
            </div>

            {/* Column 3 */}
            <div className="mb-4 text-center border-b border-[#00a651] text-white">
              <label
                htmlFor="swiftAmount"
                className="labels text-lg block text-center"
              >
                Amount
              </label>
              <input
                id="swiftAmount"
                name="swiftAmount"
                value={importProcessSWIFTData?.swiftAmount}
                onChange={(e) =>
                  handleInputChange("swiftAmount", e.target.value)
                }
                className=" w-3/4 sm:w-full input-field border-none text-[#00a651] font-bold focus:ring-transparent outline-none p-2 bg-white-bg dark:bg-black-input rounded-full autofill:bg-transparent"
                type="text"
                autoComplete="off"
              />
            </div>
            {/* Column 4 */}

            {/* Column 5 */}
            {/* <div className="mx-auto gap-4 ml-12 lg:ml-[-1.2rem] flex col-span-1 justify-evenly"> */}
            <div className="mx-auto gap-4 flex col-span-full lg:col-span-1 justify-evenly">
              {uploadedSwift ? (
                <div
                  className="med-btn-pri text-[#4edab9] font-bold border-2 border-green-sec hover:border-green-pri px-6 py-2 rounded-full cursor-pointer"
                  onClick={() => setUploadedSwift(false)}
                >
                  Uploaded
                  <span className="ml-1">✔</span>
                </div>
              ) : (
                <label className="med-btn-pri border-2 border-green-pri px-6 py-3 text-[#00a651] font-bold p-2 dark:bg-black-input rounded-full cursor-pointer">
                  <span className=" hover:text-white-text w-full py-4">
                    Attach
                  </span>
                  <input
                    type="file"
                    id="attachSwift"
                    className="attachSwift hidden"
                    onChange={handleSWIFTDocChange}
                  />
                </label>
              )}
              <button className="med-btn-sec" onClick={handleSWIFTSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportationProcessForm;
