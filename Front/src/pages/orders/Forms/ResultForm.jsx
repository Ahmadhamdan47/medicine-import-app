import React, { useState } from "react";
import "../styles.css";

const ResultForm = ({ handleInputChange, formDataStep2 }) => {
  const [uploadedPI, setUploadedPI] = useState(false);
  const [uploadedSwift, setUploadedSwift] = useState(false);

  const handlePIUpload = (e) => {
    const selectedPI = e.target.files[0];
    setUploadedPI(selectedPI ? true : false);
  };

  const handleSwiftUpload = (e) => {
    const selectedSwift = e.target.files[0];
    setUploadedSwift(selectedSwift ? true : false);
  };

  const handlePIClick = () => {
    if (uploadedPI) {
      // If already uploaded, allow clicking to clear the selection
      uploadedPI(false);
    } else {
      // If not uploaded, trigger file input click to open the file picker
      document.getElementById("attach").click();
    }
  };

  const handleSwiftClick = () => {
    if (uploadedSwift) {
      // If already uploaded, allow clicking to clear the selection
      uploadedSwift(false);
    } else {
      // If not uploaded, trigger file input click to open the file picker
      document.getElementById("attach").click();
    }
  };

  return (
    <>
      <div className="col-span-1 flex w-full sm:w-[55em] 3xl:w-full flex-col sm:col-span-1">
        <div className="image-uploader-cont flex flex-col justify-items-center"></div>
        <h1 className="pb-2 pt-4 text-center text-lg sm:py-10 sm:text-xl ">
          2 - Result
        </h1>
        <div className=" flex h-full w-full flex-col">
          <form className="grid grid-cols-1 items-center gap-10 dark:text-white-text sm:justify-items-center">
            <div className="input-container relative">
              <label
                htmlFor="pharmacyServiceDecision"
                className="labels text-lg block text-left pl-4"
              >
                Pharmacy Service Decision
              </label>
              <div className="inputs-container mt-1 h-24 w-full flex justify-center items-center gap-4 xl:gap-10 px-10 rounded-full border border-[#259f8359] dark:border-[#222222] bg-[#D9D9D9] dark:bg-[#111111] shadow-md">
                <div className="col-1 flex flex-col w-full border-b-2 border-[#259f8359]">
                  <label htmlFor="status" className="labels text-md block">
                    Status
                  </label>
                  <input
                    disabled
                    value={formDataStep2.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="border-none text-[#259f83] font-bold focus:ring-transparent outline-none p-2 bg-[#D9D9D9] dark:bg-[#111111] rounded-full"
                    type="text"
                    placeholder=""
                  />
                </div>

                <div className="vl"></div>

                <div className="col-2 flex flex-col w-full border-b-2 border-[#259f8359]">
                  <label htmlFor="qtyApproved" className="labels text-md block">
                    Qty Approved
                  </label>
                  <input
                    disabled
                    value={formDataStep2.qtyApproved}
                    onChange={(e) =>
                      handleInputChange("qtyApproved", e.target.value)
                    }
                    className="border-none text-[#259f83] font-bold focus:ring-transparent outline-none p-2 bg-[#D9D9D9] dark:bg-[#111111] rounded-full"
                    type="text"
                    placeholder=""
                  />
                </div>
              </div>
            </div>

            <div className="input-container relative">
              <label
                htmlFor="ProformaInvoice"
                className="labels text-lg block text-left pl-4"
              >
                Proforma Invoice
              </label>
              <div className="inputs-container mt-1 h-24 w-full flex justify-center items-center gap-2 xl:gap-8 px-6 pr-0 sm:px-10 rounded-full border border-[#259f8359] dark:bg-[#1e1e1e] shadow-md">
                <div className="col-1 flex flex-col w-16 md:w-28 border-b-2 border-[#259f8359] hover:border-[#5cd3b7]">
                  <label htmlFor="PInumber" className="labels text-md block">
                    Number
                  </label>
                  <input
                    value={formDataStep2.PInumber}
                    onChange={(e) =>
                      handleInputChange("PInumber", e.target.value)
                    }
                    className="border-none text-[#259f83] font-bold focus:ring-transparent outline-none p-2 dark:bg-[#1e1e1e] rounded-full"
                    type="text"
                    placeholder=""
                  />
                </div>
                <div className="vl"></div>
                <div className="col-2 flex flex-col w-[7em] border-b-2 border-[#259f8359] hover:border-[#5cd3b7]">
                  <label htmlFor="PIdate" className="labels text-md block">
                    Date
                  </label>
                  <input
                    value={formDataStep2.PIdate}
                    onChange={(e) =>
                      handleInputChange("PIdate", e.target.value)
                    }
                    className="border-none cursor-pointer text-[#259f83] font-bold focus:ring-transparent outline-none p-2 dark:bg-[#1e1e1e] rounded-full"
                    type="date"
                    placeholder=""
                  />
                </div>
                <div className="vl"></div>
                <div className="col-3 flex flex-col w-[7em] border-b-2 border-[#259f8359] hover:border-[#5cd3b7]">
                  <label htmlFor="PIamount" className="labels text-md block">
                    Amount
                  </label>
                  <input
                    value={formDataStep2.PIamount}
                    onChange={(e) =>
                      handleInputChange("PIamount", e.target.value)
                    }
                    className="border-none text-[#259f83] font-bold focus:ring-transparent outline-none p-2 dark:bg-[#1e1e1e] rounded-full"
                    type="text"
                    placeholder=""
                  />
                </div>

                <div className="vl"></div>

                <div className="col-4 flex flex-col w-16 sm:w-full border-2 border-[#259F83] rounded-full transition-all hover:border-[#5cd3b7]">
                  {uploadedPI ? (
                    <div
                      className="text-[#4edab9] font-bold py-2 cursor-pointer"
                      onClick={() => setUploadedPI(false)}
                    >
                      <span>Uploaded</span>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center bg-white text-[#259f83] font-bold p-2 dark:bg-[#1e1e1e] rounded-full cursor-pointer border-none">
                      <span>Attach</span>
                      <input
                        type="file"
                        id="attach"
                        className="hidden"
                        value={formDataStep2.proformaInvoice}
                        onChange={(e) =>
                          handlePIUpload(e)("proformaInvoice", e.target.value)
                        }
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="input-container relative">
              <label
                htmlFor="ProformaInvoice"
                className="labels text-lg block text-left pl-4"
              >
                Swift
              </label>
              <div className="inputs-container mt-1 h-24 w-full flex justify-center items-center gap-1 xl:gap-6 px-6 pr-1 sm:px-10 rounded-full border border-[#259f8359] dark:bg-[#1e1e1e] shadow-md">
                <div className="col-1 flex flex-col w-12 md:w-20 border-b-2 border-[#259f8359] hover:border-[#5cd3b7]">
                  <label htmlFor="swiftNumber" className="labels text-md block">
                    Number
                  </label>
                  <input
                    value={formDataStep2.swiftNumber}
                    onChange={(e) =>
                      handleInputChange("swiftNumber", e.target.value)
                    }
                    className="border-none text-[#259f83] font-bold focus:ring-transparent outline-none p-2 dark:bg-[#1e1e1e] rounded-full"
                    type="text"
                    placeholder=""
                  />
                </div>
                <div className="vl"></div>
                <div className="col-2 flex flex-col w-[6.5em] sm:w-[7em] border-b-2 border-[#259f8359] hover:border-[#5cd3b7]">
                  <label htmlFor="swiftDate" className="labels text-md block">
                    Date
                  </label>
                  <input
                    value={formDataStep2.swiftDate}
                    onChange={(e) =>
                      handleInputChange("swiftDate", e.target.value)
                    }
                    className="border-none cursor-pointer text-[#259f83] font-bold focus:ring-transparent outline-none p-2 dark:bg-[#1e1e1e] rounded-full"
                    type="date"
                    placeholder=""
                  />
                </div>

                <div className="vl"></div>

                <div className="col-3 flex flex-col w-[6em] sm:w-[7em] border-b-2 border-[#259f8359] hover:border-[#5cd3b7]">
                  <label htmlFor="swiftAmount" className="labels text-md block">
                    Amount
                  </label>
                  <input
                    value={formDataStep2.swiftAmount}
                    onChange={(e) =>
                      handleInputChange("swiftAmount", e.target.value)
                    }
                    className="border-none text-[#259f83] font-bold focus:ring-transparent outline-none p-2 dark:bg-[#1e1e1e] rounded-full"
                    type="text"
                    placeholder=""
                  />
                </div>

                <div className="vl"></div>

                <div className="col-4 flex flex-col w-full border-b-2 border-[#259f8359] hover:border-[#5cd3b7]">
                  <label htmlFor="bankName" className="labels text-md block">
                    Bank Name
                  </label>
                  <select
                    value={formDataStep2.bankName}
                    onChange={(e) =>
                      handleInputChange("bankName", e.target.value)
                    }
                    className="border-none  cursor-pointer text-[#259f83] font-bold focus:ring-transparent outline-none p-2 dark:bg-[#1e1e1e] rounded-full"
                    type="text"
                    placeholder=""
                  >
                    <option>Audi Bank</option>
                    <option>Byblos Bank</option>
                    <option>Bank Bemo</option>
                  </select>
                </div>

                <div className="col-4 flex flex-col w-16 sm:w-full border-2 border-[#259F83] rounded-full transition-all hover:border-[#5cd3b7]">
                  {uploadedSwift ? (
                    <div
                      className="text-[#4edab9] font-bold  p-2 cursor-pointer"
                      onClick={() => setUploadedSwift(false)}
                    >
                      <span>Uploaded</span>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center bg-white text-[#259f83] font-bold p-2 dark:bg-[#1e1e1e] rounded-full cursor-pointer border-none">
                      <span>Attach</span>
                      <input
                        type="file"
                        id="attach"
                        className="hidden"
                        value={formDataStep2.swift}
                        onChange={(e) =>
                          handleSwiftUpload(e)("swift", e.target.value)
                        }
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResultForm;
