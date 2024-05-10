/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import axios from "axios";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import React, { useState, useEffect, forwardRef } from "react";

import "./ViewModalStyles.css";
import ImageSlider from "./ImageSlider";


Modal.setAppElement("#root");

const SingleDrug = forwardRef(({ guid, className }, ref) => {
  // const { drugId } = useParams();
  const [drug, setDrug] = useState([]);
  const { selectDrug } = useState();

  useEffect(() => {
    if (!guid) return; // Make sure guid is not null or undefined

    axios
      .get(`http://localhost:3000/drugs/guid/${guid}`)
      .then((res) => {
        const drugData = res.data;
        setDrug(drugData);
        selectDrug(drugData);
      })
      .catch((error) => {
        console.error("Error fetching drug:", error);
      });
  }, [guid, selectDrug]);

  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:3000/drugs/guid/${guid}`)
  //     .then((res) => {
  //       // Set selected drug data in context
  //       selectDrug(res.data);
  //     })
  //     .catch((error) => {
  //       console.error(`Error fetching drug with GUID ${guid}:`, error);
  //     });
  // }, [guid, selectDrug]);

  // ////////////////////////////////////////////

  // useEffect(() => {
  //   if (!guid) {
  //     console.error("Drug ID is undefined");
  //     return;
  //   }

  //   axios
  //     .get(`http://localhost:3000/drugs/${drugId}`)
  //     .then((res) => {
  //       setDrug(res.data);
  //     })
  //     .catch((error) => {
  //       console.error(`Error fetching drug with ID ${drugId}:`, error);
  //     });
  // }, [drugId]);

  // // Forwarding the ref to the underlying DOM element
  // useEffect(() => {
  //   if (ref && drug.length > 0) {
  //     ref.current = drug;
  //   }
  // }, [ref, drug]);

  return (
    <div className="flex flex-col h-full pb-28" ref={ref}>
      <div
        className={`grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 h-full ${className}`}
      >
        <div className="col-1 w-full col-span-3 md:col-span-3 lg:col-span-1">
          {/* <div className="col-span-1 md:col-span-2 w-full h-full overflow-auto"> */}
          {drug.drugImages && drug.drugImages.length > 0 && (
            <ImageSlider images={drug.drugImages} />
          )}
          {/* </div> */}
        </div>

        <div className="col-2 col-span-3 md:col-span-3 lg:col-span-2 flex flex-col border w-full h-full rounded-xl border-black-text dark:border-green-pri">
          <div className="name-price-cont p-4 text-left">
            <h2 className="text-2xl leading-none font-bold">
              {drug.BrandName}
            </h2>
            <div className="text-xl leading-none">
              {drug.ingredientsAndstrength}
              <span className="text-green-pri ml-2">
                {drug.dosageValueN} {drug.dosageUnitN}
              </span>
            </div>
          </div>

          <div className="prices-cont flex flex-col sm:flex-row w-full h-auto gap-4 p-4">
            <p className="text-gray-600 mb-">{drug.presentation}</p>
            <div className="flex flex-col justify-center items-center text-lg font-semibold sm:text-xl border-[0.150rem] border-green-pri rounded-xl p-3 w-fit md:w-auto">
              Foreign Price
              <span className="font-bold text-green-pri">
                {drug.priceForeign} {drug.currencyForeign}
              </span>
            </div>
            <div className="flex flex-col justify-center font-semibold items-center text-lg sm:text-xl border-[0.150rem] border-green-pri rounded-xl p-3 w-fit md:w-auto">
              Price in US Dollar
              <span className="font-bold text-green-pri">
                {drug.convertToUSD} USD
              </span>
            </div>
            <div className="flex flex-col justify-center items-center text-black-text dark:text-white-text text-lg font-semibold sm:text-xl border-[0.150rem] border-green-pri rounded-xl p-3 w-fit md:w-auto">
              Price in Lebanese Pound
              <span className="font-bold text-green-pri ">
                {drug.convertToLBP} LBP
              </span>
            </div>
          </div>
          <div className="flex justify-center sm:justify-start sm:pl-3">
            <Link to="/substitute">
              <button className="med-btn-pri bg-green-pri hover:text-green-pri hover:shadow hover:shadow-green-pri transition-all text-white-text px-4 py-2 my-6 border border-green-pri rounded-md hover:bg-transparent hover:border hover:border-green-pri">
                Substitute
              </button>
            </Link>
          </div>
        </div>

        <div className="col-span-3 flex flex-col w-full h-fit p-4 text-left border-black-text dark:border-green-pri border rounded-xl">
          <h3 className="text-4xl mb-4">Medicine Details</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {/* COL 1 */}
            <div className="">
              <div className="flex items-center w-fit gap-2">
                <h4 className="text-lg font-medium">Ingredients:</h4>
                <p className="text-green-pri text-[1.1rem]">
                  {drug.ingredientsAndstrength}
                </p>
              </div>
              <div className="flex items-center w-fit gap-2">
                <h4 className="text-lg font-medium">Dosage:</h4>
                <p className="text-green-pri text-[1.1rem]">
                  {drug.dosageValueN} {drug.dosageUnitN}
                </p>
              </div>
              <div className="flex items-center w-fit gap-2">
                <h4 className="text-lg font-medium">Form:</h4>
                <p className="text-green-pri text-[1.1rem]">{drug.form}</p>
              </div>
            </div>
            {/* COL 2 */}
            <div className="">
              <div className="flex items-center w-fit gap-2">
                <h4 className="text-lg font-medium">Type:</h4>
                <p className="text-green-pri text-[1.1rem]">{drug.type}</p>
              </div>
              <div className="flex items-center w-fit gap-2">
                <h4 className="text-lg font-medium">Route:</h4>
                <p className="text-green-pri text-[1.1rem]">{drug.route}</p>
              </div>
              <div className="flex items-center w-fit gap-2">
                <h4 className="text-lg font-medium">Presentation</h4>
                <p className="text-green-pri text-[1.1rem]">
                  {drug.presentationContentQty}
                </p>
              </div>
            </div>
            {/* COL 3 */}
            <div className="">
              <div className="flex items-center w-fit gap-2">
                <h4 className="text-lg font-medium">Country:</h4>
                <p className="text-green-pri text-[1.1rem]">
                  {drug.manufacturingCountry}
                </p>
              </div>
              <div className="flex items-center w-fit gap-2">
                <h4 className="text-lg font-medium">Stratum:</h4>
                <p className="text-green-pri text-[1.1rem]">{drug.stratum}</p>
              </div>
              <div className="flex items-center w-fit gap-2">
                <h4 className="text-lg font-medium">Cargo & Shipping:</h4>
                <p className="text-green-pri text-[1.1rem]">
                  {drug.cargoShippingTerms}
                </p>
              </div>
            </div>
            {/* COL 4 */}
            <div className="">
              <div className="flex items-center w-fit gap-2">
                <h4 className="text-lg font-medium">ATC Code:</h4>
                <p className="text-green-pri text-[1.1rem]">{drug.atcCode}</p>
              </div>
              <div className="flex items-center w-fit gap-2">
                <h4 className="text-lg font-medium">Registration #:</h4>
                <p className="text-green-pri text-[1.1rem]">
                  {drug.registrationNumber}
                </p>
              </div>
              <div className="flex items-center w-fit gap-2">
                <h4 className="text-lg font-medium">MOH Code:</h4>
                <p className="text-green-pri text-[1.1rem]">{drug.mohCode}</p>
              </div>
            </div>
            {/* COL 5 */}
            <div className="">
              <div className="">
                <h4 className="text-lg font-medium">Agent</h4>
                <p className="text-green-pri text-[1.1rem]">{drug.agent}</p>
              </div>
              <div className="">
                <h4 className="text-lg font-medium">Dosage</h4>
                <p className="text-green-pri text-[1.1rem]">
                  {drug.dosageValueN}
                </p>
              </div>
              <div className="">
                <h4 className="text-lg font-medium">Form</h4>
                <p className="text-green-pri text-[1.1rem]">{drug.form}</p>
              </div>
            </div>
            {/* COL 6 */}
            <div className="">
              <div className="">
                <h4 className="text-lg font-medium">Ingredients</h4>
                <p className="text-green-pri text-[1.1rem]">
                  {drug.ingredientsAndstrength}
                </p>
              </div>
              <div className="">
                <h4 className="text-lg font-medium">Dosage</h4>
                <p className="text-green-pri text-[1.1rem]">
                  {drug.dosageValueN} {drug.dosageUnitN}
                </p>
              </div>
              <div className="">
                <h4 className="text-lg font-medium">Form</h4>
                <p className="text-green-pri text-[1.1rem]">{drug.form}</p>
              </div>
            </div>
            {/* COL 7 */}
            <div className="">
              <div className="">
                <h4 className="text-lg font-medium">Ingredients</h4>
                <p className="text-green-pri text-[1.1rem]">
                  {drug.ingredientsAndstrength}
                </p>
              </div>
              <div className="">
                <h4 className="text-lg font-medium">Dosage</h4>
                <p className="text-green-pri text-[1.1rem]">
                  {drug.dosageValueN} {drug.dosageUnitN}
                </p>
              </div>
              <div className="">
                <h4 className="text-lg font-medium">Form</h4>
                <p className="text-green-pri text-[1.1rem]">{drug.form}</p>
              </div>
            </div>
            {/* COL 8 */}
            <div className="">
              <div className="">
                <h4 className="text-lg font-medium">Ingredients</h4>
                <p className="text-green-pri text-[1.1rem]">
                  {drug.ingredientsAndstrength}
                </p>
              </div>
              <div className="">
                <h4 className="text-lg font-medium">Dosage</h4>
                <p className="text-green-pri text-[1.1rem]">
                  {drug.dosageValueN} {drug.dosageUnitN}
                </p>
              </div>
              <div className="">
                <h4 className="text-lg font-medium">Form</h4>
                <p className="text-green-pri text-[1.1rem]">{drug.form}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default SingleDrug;
