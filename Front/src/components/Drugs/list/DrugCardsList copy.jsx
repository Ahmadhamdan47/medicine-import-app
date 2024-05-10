// //////////////////////////////////////////////////////////////////////////

import axios from "axios";
import { Link } from "react-router-dom";
import { HiTrash, HiPencilAlt } from "react-icons/hi";
import React, { useRef, useState, useEffect } from "react";

import "../../../index.css";
import subs2 from "../../../images/subs2.png";
import lebflag from "../../../images/lebflag.png";
import useCustomNavigation from "../../useCustomNavigation";
import drugPlaceholder from "../../../images/drugPlaceholder.png";

function List({ className }) {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { goToListPage } = useCustomNavigation(false);
  const [pollingInterval, setPollingInterval] = useState(null);
  const isMounted = useRef(true);

  async function loadDrugs() {
    try {
      console.log("Fetching drugs...");
      const res = await axios.get("http://1.1.1.250:3500/drugs");
      console.log("Response data:", res.data);

      if (isMounted.current) {
        const newData = parseResponseData(res.data);
        console.log("Parsed data:", newData);
        setDrugs(newData);
        setLoading(false);
        console.log("Drugs loaded successfully.");
      }
    } catch (error) {
      if (isMounted.current) {
        console.error("There's a problem listing the medications:", error);
        setLoading(false);
      }
    }
  }

  const parseResponseData = (data) => {
    if (Array.isArray(data)) {
      return data.reverse();
    } if (typeof data === "object" && data !== null) {
      return [data];
    } 
      console.error("Invalid response format: expected an array");
      return [];
    
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data on mount...");
      await loadDrugs();
    };

    fetchData();

    // Set up polling interval only once on mount
    if (!pollingInterval) {
      console.log("Setting up polling interval...");
      const intervalId = setInterval(() => {
        console.log("Fetching data through polling...");
        fetchData();
      }, 5 * 60 * 1000);
      setPollingInterval(intervalId);
    }

    return () => {
      // Clear the interval when the component is unmounted
      if (pollingInterval) {
        console.log("Clearing polling interval...");
        clearInterval(pollingInterval);
      }
      isMounted.current = false;
      console.log("Component unmounted.");
    };
  }, [pollingInterval]);

  function deleteDrug(id) {
    console.log(`Deleting drug with ID: ${id}`);
    axios
      .delete(`http://1.1.1.250:3500/drugs/${id}`)
      .then(() => {
        console.log("Drug deleted successfully. Reloading drugs...");
        loadDrugs();
      })
      .catch((error) => {
        console.error("Error deleting drug:", error);
      });
  }

  const filteredDrugs = drugs.filter((data) => {
    const drugName = data.drugName && data.drugName.toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();

    return drugName && drugName.includes(searchTermLower);
  });

  console.log("Rendering List component with drugs:", filteredDrugs);

  return (
    <div className={`flex flex-col sm:p-4 ${className}`}>
      <div className="mb-4 flex flex-col justify-center items-center">
        <label className="text-green-pri text-3xl mb-2">Search</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-[50%] p-2 rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredDrugs.length === 0 ? (
        <p className="mb-4 text-2xl text-gray-600">
          No Drugs Data Available. Click{" "}
          <Link
            to="/add"
            className="font-semibold text-teal-600 hover:underline mx-2"
          >
            Add
          </Link>
          to create a new drug.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-14 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 py-10 px-2">
          {filteredDrugs.map((data, index) => (
              <div
                key={index}
                className="card w-full overflow-hidden bg-white-fg dark:bg-black-input rounded-3xl border-2 border-[#00a651] outline-none hover:border-green-pri hover:outline-none hover:ring-2 hover:ring-green-pri dark:hover:ring-2 dark:hover:ring-green-pri p- shadow-xl transition duration-300 hover:scale-105 hover:shadow-2xl dark:text-white-text dark:shadow-lg dark:shadow-[#24382ab0]"
              >
                <Link
                  to={data._id ? `/viewdrug/${data._id}` : "/"}
                  className="text-black-text no-underline bg-black-bg dark:bg-black-bg dark:text-white-text"
                >
                  <div className="flex">
                    <div className="flex w-2/5 flex-col">
                      <div className="w-full p-2">
                        {data.drugImages && data.drugImages.length > 0 ? (
                          <img
                            src={data.drugImages[0].imageUrl}
                            alt={`Drug ${index + 1}`}
                            className="h-44 w-full object-contain"
                            onError={(e) =>
                              console.error(
                                `Error loading image for Drug ${index + 1}:`,
                                e
                              )
                            }
                          />
                        ) : (
                          <img
                            src={drugPlaceholder}
                            alt={`Drug ${index + 1}`}
                            className="h-44 w-full object-contain"
                            onLoad={() =>
                              console.log(
                                `Placeholder image loaded for Drug ${index + 1}`
                              )
                            }
                            onError={() =>
                              console.error(
                                `Error loading placeholder image for Drug ${
                                  index + 1
                                }`
                              )
                            }
                          />
                        )}
                      </div>
                      <div className="w-full pr-8 sm:pr-12 md:pr-[70px] lg:pr-5 ">
                        <p className="text-md text-right text-[#00a651]">
                          {data.convertToLBP} LBP
                        </p>
                      </div>
                      <div className="w-full pr-8 sm:pr-12  md:pr-[70px] lg:pr-5 ">
                        <p className="text-md text-right text-[#00a651]">
                          {data.convertToUSD} USD
                        </p>
                      </div>
                      <div className="w-full pr-8 sm:pr-12  md:pr-[70px] lg:pr-5 ">
                        <p className="text-md text-right text-[#00a651]">
                          {data.pillPriceLB} LBP/Pill
                        </p>
                      </div>
                    </div>

                    <div className="w-3/5 p-4 text-left">
                      <h2 className="mb-2 text-2xl font-semibold">
                        {data.drugName}
                      </h2>
                      <p className="mb-2 text-sm italic text-gray-600 dark:text-gray-400">
                        {data.ingredientsAndstrength}
                        <span className="ml-1">
                          <span className="mr-1">{data.dosageValueN}</span>
                          <span className="">{data.dosageUnitN}</span>
                        </span>
                      </p>
                      <p className="font-bold">
                        <span className="font-normal mr-1">Dose:</span>
                        <span className="mr-1">{data.dosageValueN}</span>
                        <span className="">{data.dosageUnitN}</span>
                      </p>
                      <p className="font-bold">
                        <span className="font-normal mr-1">Presentation: </span>
                        {data.presentationContentQty}
                      </p>
                      <p className="font-bold">
                        <span className="font-normal mr-1">Form: </span>
                        {data.form}
                      </p>
                      <p className="font-bold">
                        <span className="font-normal mr-1">Route: </span>
                        {data.route}
                      </p>
                      <p className="font-bold">
                        <span className="font-normal mr-1">Type: </span>
                        {data.type}
                      </p>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center w-full justify-between bg-white-contents p-1 sm:px-3 pr-2">
                  <div className="edit-delete flex flex-col sm:flex-row">
                    <Link
                      to={data._id ? `/editdrug/${data._id}` : "/"}
                      className={`text-teal-600 hover:underline ${
                        !data._id ? "cursor-not-allowed" : ""
                      }`}
                    >
                      <HiPencilAlt className="mr-2 inline-block" />
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteDrug(data._id)}
                      className="ml-2 text-red-600 hover:underline"
                    >
                      <HiTrash className="mr-2 inline-block" />
                      Delete
                    </button>
                  </div>
                  <div className="flex items-center justify-around">
                    <Link to="/substitute">
                      <img
                        src={subs2}
                        className="w-[120px] cursor-pointer"
                        alt=""
                       />
                    </Link>
                  </div>
                  <div className="flex flex-col-reverse sm:flex-row w-fit items-center justify-center gap-1">
                    <p className=" text-xs text-black-text">Made in Lebanon</p>
                    <img className="w-[50px]" src={lebflag} alt="" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default List;

// //////////////////////////////////////////////////////////////////////////
