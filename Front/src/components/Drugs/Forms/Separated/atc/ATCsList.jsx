import { Link } from "react-router-dom";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import React, { useMemo, useState, useEffect } from "react";

import { AddIcon } from "../AddIcon";
// import axios from "axios";
import Axios from "../../../../../api/axios";


const ATCsList = (onCreateBtnClick) => {
  const [atcCodes, setAtcCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const atcResponse = await Axios.get("/api/atc/v1.0");
        const atcItems = Array.isArray(atcResponse.data)
          ? atcResponse.data
          : [];
        const atcCodeData = await Promise.all(
          atcItems.map(async (atcItem) => {
            const atcCodeResponse = await Axios.get(
              `/api/atccodes/v1.0/codes/${atcItem.guid}`
            );
            return atcCodeResponse.data;
          })
        );
        setAtcCodes(atcCodeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (sortConfig.key !== null) {
      return [...atcCodes].sort((a, b) => {
        const valueA = a[0] ? a[0][sortConfig.key] : "";
        const valueB = b[0] ? b[0][sortConfig.key] : "";
        if (valueA < valueB) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return atcCodes;
  }, [atcCodes, sortConfig]);

  const filteredData = useMemo(() => sortedData.filter((atcCodeItem) => (
        atcCodeItem[0]?.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        atcCodeItem[0]?.levelName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        atcCodeItem[0]?.levelNameAr
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        atcCodeItem[0]?.substanceName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        atcCodeItem[0]?.atcingredientName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        atcCodeItem[0]?.atcingredientNameAr
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        atcCodeItem[0]?.interactionIngredientName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )), [sortedData, searchTerm]);

  return (
    <div className="container mx-auto h-screen p-4 text-black-text dark:text-white-text">
      <h2 className="text-[1.750rem] text-center text-green-pri font-medium">
        ATCs Data
      </h2>
      <div className="flex justify-between items-center pb-4 py-6">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-md py-1 px-3 dark:border-white-text text-black-text dark:text-white-text bg-white-bg dark:bg-black-bg dark:focus:border-transparent outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
        />
 <Link to="/atc/new" className="icon-hovered button-with-icon">
            <AddIcon />
           
          </Link>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto max-h-[calc(100vh-284px)]">
          <table className="w-full table-auto border border-collapse">
            <thead className="select-none h-10 sticky top-0 z-20 bg-gray-200 dark:bg-black-input font-normal">
              <tr>
                <th className="relative">
                  <div
                    onClick={() => requestSort("code")}
                    className="cursor-pointer"
                  >
                    Code
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                      {sortConfig.key === "code" &&
                        (sortConfig.direction === "asc" ? (
                          <FaSortDown />
                        ) : (
                          <FaSortUp />
                        ))}
                    </div>
                  </div>
                </th>

                <th className="relative">
                  <div
                    onClick={() => requestSort("levelName")}
                    className="cursor-pointer"
                  >
                    Level Name
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                      {sortConfig.key === "levelName" &&
                        (sortConfig.direction === "asc" ? (
                          <FaSortDown />
                        ) : (
                          <FaSortUp />
                        ))}
                    </div>
                  </div>
                </th>

                <th className="relative">
                  <div
                    onClick={() => requestSort("levelNameAr")}
                    className="cursor-pointer"
                  >
                    Level Name ar
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                      {sortConfig.key === "levelNameAr" &&
                        (sortConfig.direction === "asc" ? (
                          <FaSortDown />
                        ) : (
                          <FaSortUp />
                        ))}
                    </div>
                  </div>
                </th>

                <th className="relative">
                  <div
                    onClick={() => requestSort("substanceName")}
                    className="cursor-pointer"
                  >
                    Substance
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                      {sortConfig.key === "substanceName" &&
                        (sortConfig.direction === "asc" ? (
                          <FaSortDown />
                        ) : (
                          <FaSortUp />
                        ))}
                    </div>
                  </div>
                </th>

                <th className="relative">
                  <div
                    onClick={() => requestSort("atcingredientName")}
                    className="cursor-pointer"
                  >
                    ATC ingredient
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                      {sortConfig.key === "atcingredientName" &&
                        (sortConfig.direction === "asc" ? (
                          <FaSortDown />
                        ) : (
                          <FaSortUp />
                        ))}
                    </div>
                  </div>
                </th>

                <th className="relative">
                  <div
                    onClick={() => requestSort("atcingredientNameAr")}
                    className="cursor-pointer"
                  >
                    ATC ingr ar
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                      {sortConfig.key === "atcingredientNameAr" &&
                        (sortConfig.direction === "asc" ? (
                          <FaSortDown />
                        ) : (
                          <FaSortUp />
                        ))}
                    </div>
                  </div>
                </th>

                <th className="relative">
                  <div
                    onClick={() => requestSort("interactionIngredientName")}
                    className="cursor-pointer"
                  >
                    Interaction ing
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                      {sortConfig.key === "interactionIngredientName" &&
                        (sortConfig.direction === "asc" ? (
                          <FaSortDown />
                        ) : (
                          <FaSortUp />
                        ))}
                    </div>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="text-center overflow-y-auto z-0">
              {filteredData.map((atcCodeItem, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-white-contents dark:hover:bg-black-contents"
                >
                  <td className="py-2 px-4">{atcCodeItem[0]?.code}</td>
                  <td className="py-2 px-4">{atcCodeItem[0]?.levelName}</td>
                  <td className="py-2 px-4">{atcCodeItem[0]?.levelNameAr}</td>
                  <td className="py-2 px-4">{atcCodeItem[0]?.substanceName}</td>
                  <td className="py-2 px-4">
                    {atcCodeItem[0]?.atcingredientName}
                  </td>
                  <td className="py-2 px-4">
                    {atcCodeItem[0]?.atcingredientNameAr}
                  </td>
                  <td className="py-2 px-4">
                    {atcCodeItem[0]?.interactionIngredientName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ATCsList;