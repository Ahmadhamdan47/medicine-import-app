/* eslint-disable tailwindcss/no-custom-classname */
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link , useParams, useNavigate } from "react-router-dom";

// import EditSuccessPopup from "./EditSuccessPopup"; // Import the EditSuccessPopup component
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";


const dosageOptions = {
  "%": "%",
  billions: "billions",
  "billions/g": "billions/g",
  CCID50: "CCID50",
  "ELISA units/ml": "ELISA units/ml",
  g: "g",
  "g/g": "g/g",
  "g/L": "g/L",
  "mg/g": "mg/g",
  "g/ml": "g/ml",
  "IR or IC/ml": "IR or IC/ml",
  IU: "IU",
  "IU/actuation": "IU/actuation",
  "IU/drop": "IU/drop",
  "IU/g": "IU/g",
  "IU/ml": "IU/ml",
  LRU: "LRU",
  LSU: "LSU",
  mcg: "mcg",
  "mcg/dose": "mcg/dose",
  "mcg/g": "mcg/g",
  "mcg/mcg": "mcg/mcg",
  "mcg/mg": "mcg/mg",
  "mcg/ml": "mcg/ml",
  "mcl/ml": "mcl/ml",
  mg: "mg",
  MIU: "MIU",
  "MIU/ml": "MIU/ml",
  ml: "ml",
  "ml/l": "ml/l",
  "ml/ml": "ml/ml",
  PFU: "PFU",
  "U.CEIP": "U.CEIP",
  "U.CEIP/ml": "U.CEIP/ml",
  "U/ml": "U/ml",
  "units LD50": "units LD50",
};

const routeOptions = {
  Epidural: "Epidural",
  Epilesional: "Epilesional",
  Haemodialysis: "Haemodialysis",
  Infusion: "Infusion",
  "Peritoneal Dialysis": "Peritoneal Dialysis",
  Rectal: "Rectal",
  Respiratory: "Respiratory",
  "soft tissue injection": "soft tissue injection",
  Subcutaneous: "Subcutaneous",
  Sublingual: "Sublingual",
  Topical: "Topical",
  "Topical scalp": "Topical scalp",
  Transdermal: "Transdermal",
  Vaginal: "Vaginal",
  "Varicose vein": "Varicose vein",
};

function EditDrug() {
  const { drugId } = useParams();
  const navigate = useNavigate();

  const [drug, setDrug] = useState({
    drugImages: "",
    drugName: "",
    ingredientsAndstrength: "",
    convertToLBP: "",
    dosageValueN: "",
    presentationContentQty: "",
    form: "",
    route: "",
    type: "",
    country: "",
    agent: "",
    manufacturer: "",
    manufacturingCountry: "",
    subsidyPercentage: "",
    stratum: "",
    atcCode: "",
    mohCode: "",
    registrationNumber: "",
  });

  useEffect(() => {
    // Check if drugId is truthy before making the GET request
    if (drugId) {
      axios
        .get(`http://1.1.1.250:3500/drugs/${drugId}`)
        .then((res) => {
          setDrug(res.data);
        })
        .catch((error) => {
          console.error("Error fetching drug data:", error);
          // Handle the error, such as redirecting to an error page
        });
    }
  }, [drugId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDrug((prevDrug) => ({
      ...prevDrug,
      [name]: value,
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(`http://1.1.1.250:3500/drugs/${drugId}`, drug)
      .then(() => {
        console.log("Update successful");
        navigate("/list");
      })
      .catch((error) => {
        console.error("Failed updating the medicine data:", error);
        // Handle the error, such as displaying an error message to the user
      });
  };

  return (
    <div className="flex h-auto w-full flex-col items-center justify-center dark:text-white-text pb-20">
      <Link
        to="/list"
        className="mb-4 inline-block self-start p-3 text-lg text-green-pri"
      >
        <ArrowBackIosIcon fontSize="medium" className="inline align-middle" />
        Back
      </Link>
      <h1 className="text-3xl font-bold">Medicine Details</h1>
      <form
        className="w-full lg:w-[80%] grid grid-cols-1 md:grid-cols-2 gap-20 items-baseline p-8 mb-5"
        // className="mt-2 mb-4 p-8 flex h-full w-full md:w-[50%] flex-col "
        onSubmit={handleUpdate}
      >
        <div className="flex flex-col">
          <div className="input-container relative">
            <label
              htmlFor="drugName"
              className="labels mt-4 text-left text-lg font-bold"
            >
              Drug Name:
            </label>
            <input
              name="drugName"
              value={drug.drugName}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
              type="text"
              placeholder="brand name"
            />
          </div>
          <div className="input-container relative" />
          <label
            htmlFor="ingredientsAndstrength"
            className="labels mt-4 text-left text-lg font-bold"
          >
            Ingredients:
          </label>
          <input
            name="ingredientsAndstrength"
            value={drug.ingredientsAndstrength}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            placeholder="drug ingredients"
          />
          <div className="input-container relative" />
          <label
            htmlFor="convertToLBP"
            className="labels mt-4 text-left text-lg font-bold"
          >
            Public Price in LBP:
          </label>
          <input
            name="convertToLBP"
            value={drug.convertToLBP}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="number"
            placeholder="drug priceLB"
          />
          <div className="input-container relative" />
          <label
            htmlFor="dosageValueN"
            className="labels mt-4 text-left text-lg font-bold"
          >
            Dose:
          </label>
          <div className="relative" style={{ borderColor: "transparent" }}>
            <input
              type="number"
              name="dosageValueN"
              id="dosageValueN"
              className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
              placeholder="0"
              value={drug.dosageValueN}
              onChange={handleInputChange}
            />
            <div className="absolute  inset-y-0 right-0 flex items-center">
              <select
                id="dosageUnitN"
                name="dosageUnitN"
                className="w-16 cursor-pointer appearance-none rounded-r-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-fg p-2 pr-8 font-normal outline-none focus:border-green-pri focus:outline-none focus:ring-1 focus:ring-green-pri  sm:w-28"
                value={drug.dosageUnitN}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Select a unit
                </option>
                {Object.keys(dosageOptions).map((dosageUnitN) => (
                  <option key={dosageUnitN} value={dosageUnitN}>
                    {dosageUnitN}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-container relative" />

          <label
            htmlFor="ingredients"
            className="labels mt-4 text-left text-lg font-bold"
          >
            Presentation:
          </label>
          <input
            name="presentationContentQty"
            value={drug.presentationContentQty}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            placeholder="drug presentation"
          />
          <div className="input-container relative" />
          <label
            htmlFor="ingredients"
            className="labels mt-4 text-left text-lg font-bold"
          >
            Form:
          </label>
          <input
            name="form"
            value={drug.form}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            placeholder="drug form"
          />
          <label
            htmlFor="route"
            className="labels mt-4 text-left text-lg font-bold"
          >
            Route:
          </label>
          <select
            id="route"
            name="route"
            className="mt-1 w-full cursor-pointer rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            value={drug.route}
            onChange={handleInputChange}
          >
            <option value="" disabled>
              Select a route
            </option>
            {Object.keys(routeOptions).map((route) => (
              <option key={route} value={route}>
                {route}
              </option>
            ))}
          </select>

          <label
            htmlFor="ingredients"
            className="labels mt-4 text-left text-lg font-bold"
          >
            Type:
          </label>
          <input
            name="type"
            value={drug.type}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            placeholder="drug type"
          />
          <label
            htmlFor="ingredients"
            className="labels mt-4 text-left text-lg font-bold"
          >
            country:
          </label>
          <input
            name="country"
            value={drug.country}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            placeholder="drug country"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="agent"
            className="labels mt-4 text-left text-lg font-bold"
          >
            Agent:
          </label>
          <input
            name="agent"
            value={drug.agent}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            placeholder="agent"
          />
          <label
            htmlFor="ingredients"
            className="labels mt-4 text-left text-lg font-bold"
          >
            Manufacturer:
          </label>
          <input
            name="manufacturer"
            value={drug.manufacturer}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            placeholder="drug manufacturer"
          />
          <label
            htmlFor="ingredients"
            className="labels mt-4 text-left text-lg font-bold"
          >
            Manufacturing Country:
          </label>
          <input
            name="manufacturingCountry"
            value={drug.manufacturingCountry}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            placeholder="select Country"
          />
          <label
            htmlFor="subsidyPercentage"
            className="labels mt-4 text-left text-lg font-bold"
          >
            Subsidy Percentage:
          </label>
          <input
            name="subsidyPercentage"
            value={drug.subsidyPercentage}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            placeholder="Subsidy Percentage"
          />
          <label
            htmlFor="stratum"
            className="labels mt-4 text-left text-lg font-bold"
          >
            Stratum:
          </label>
          <input
            name="stratum"
            value={drug.stratum}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            placeholder="drug stratum"
          />
          <label
            htmlFor="atcCode"
            className="labels mt-4 text-left text-lg font-bold"
          >
            ATC Code:
          </label>
          <input
            name="atcCode"
            value={drug.atcCode}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            placeholder="atc code"
          />
          <label
            htmlFor="atcCode"
            className="labels mt-4 text-left text-lg font-bold"
          >
            moph Code:
          </label>
          <input
            name="mohCode"
            value={drug.mohCode}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            placeholder="code"
          />
          <label
            htmlFor="registrationNumber"
            className="labels mt-4 text-left text-lg font-bold"
          >
            Registration Number:
          </label>
          <input
            name="registrationNumber"
            value={drug.registrationNumber}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
            type="text"
            placeholder="Registration Number"
          />
        </div>
        <div className="col-span-full grid justify-center">
          <button
            type="submit"
            className="w-52 bg-green-pri hover:bg-green-sec dark:text-white-text text-xl py-2 px-4 rounded-full transition duration-300 ease-in-out"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditDrug;
