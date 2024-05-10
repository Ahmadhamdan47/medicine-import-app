/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import "../styles.css";

const RequestForImporationForm = ({ handleInputChange, formDataStep1 }) => {
  return (
    <>
      <div className="col-span-1 flex w-full sm:w-[70em] flex-col sm:col-span-1">
        <div className="image-uploader-cont flex flex-col justify-items-center"></div>
        <h1 className="pb-2 pt-4 text-center text-xl sm:py-10 sm:text-xl ">
          1 - Request For Importation Form
        </h1>
        <div className=" flex h-full w-full flex-col">
          <form className="grid grid-cols-1 items-center gap-8 lg:gap-16 dark:text-white-text sm:grid-cols-2 sm:justify-items-center md:grid-cols-2 lg:grid-cols-2">
            <div className="input-container relative">
              <label
                htmlFor="RequestedDrug"
                className="labels text-lg block text-left"
              >
                Select Requested Drug
              </label>
              <input
                value={formDataStep1.RequestedDrug}
                onChange={(e) =>
                  handleInputChange("RequestedDrug", e.target.value)
                }
                className="mt-1 w-full  rounded-full border border-[#259f8359] bg-white/10 px-4 py-2 font-normal shadow-md outline-none focus:border-[#5cd3b7] focus:outline-none focus:ring-1 focus:ring-[#5cd3b7] dark:bg-[#1e1e1e] "
                type="text"
                placeholder="drug name"
              />
            </div>

            <div className="input-container relative">
              <label
                htmlFor="quantityRequested"
                className="labels text-lg block text-left"
              >
                Quantity Requested
              </label>
              <input
                value={formDataStep1.quantityRequested}
                onChange={(e) =>
                  handleInputChange("quantityRequested", e.target.value)
                }
                className="mt-1 w-full rounded-full border border-[#259f8359] bg-white/10 px-4 py-2 font-normal shadow-md outline-none focus:border-[#5cd3b7] focus:outline-none focus:ring-1 focus:ring-[#5cd3b7] dark:bg-[#1e1e1e] "
                type="text"
                placeholder="qty"
              />
            </div>

            <div className="input-container relative">
              <label
                htmlFor="notes"
                className="labels text-lg block text-left"
              >
                Offer
              </label>
              <div className="offer-container mt-1 h-24 w-full flex justify-center items-center gap-4 xl:gap-10 sm:px-6 rounded-full border border-[#259f8359] dark:bg-[#1e1e1e] shadow-md">
                <div className="col-1 flex flex-col w-[6em] xs:w-[14em] border-b-2 border-[#259f8359] hover:border-[#5cd3b7]">
                  {/* <div className="offerType-col flex flex-col border-red-500 border"> */}
                  <label htmlFor="offerType" className="labels text-md block">
                    Type
                  </label>
                  <select
                    value={formDataStep1.offerType}
                    onChange={(e) =>
                      handleInputChange("offerType", e.target.value)
                    }
                    className="cursor-pointer border-none focus:ring-transparent outline-none p-2 dark:bg-[#1e1e1e] rounded-full"
                    type="text"
                    placeholder=""
                  >
                    <option value="" disabled>
                      select a type
                    </option>
                    <option>type 1</option>
                    <option>type 2</option>
                    <option>type 3</option>
                  </select>
                </div>
                {/* </div> */}

                <div className="vl"></div>

                <div className="col-2 flex flex-col w-[6em] xs:w-[14em] border-b-2 border-[#259f8359] hover:border-[#5cd3b7]">
                  <label
                    htmlFor="offerPercentage"
                    className="labels text-md block"
                  >
                    Select Input
                  </label>
                  <select
                    value={formDataStep1.offerPercentage}
                    onChange={(e) =>
                      handleInputChange("offerPercentage", e.target.value)
                    }
                    className=" cursor-pointer border-none focus:ring-transparent outline-none p-2 dark:bg-[#1e1e1e] rounded-full"
                    type="text"
                    placeholder="%"
                  >
                    <option value="" disabled>
                      select a percentage
                    </option>
                    <option>5%</option>
                    <option>10%</option>
                    <option>20%</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="input-container relative">
              <label htmlFor="notes" className="labels text-lg block text-left">
                Notes
              </label>
              <textarea
                value={formDataStep1.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="mt-1 w-full h-24 rounded-full border border-[#259f8359] bg-white/10 px-6 py-2 font-normal shadow-md outline-none focus:border-[#5cd3b7] focus:outline-none focus:ring-1 focus:ring-[#5cd3b7] dark:bg-[#1e1e1e]"
                type="text"
                placeholder=""
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RequestForImporationForm;
