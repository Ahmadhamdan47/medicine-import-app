import { useTable, useSortBy } from "react-table";
import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

import Axios from "../../../../../api/axios";

const ATCsList = () => {
  const { guid } = useParams();
  const [data, setData] = useState([]);
  const [atcCodeData, setAtcCodeData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await Axios.get(
          guid ? `/api/atc/v1.0?guid=${guid}` : "/api/atc/v1.0"
        );
        setData(Array.isArray(response.data) ? response.data : []);
        localStorage.setItem("data", JSON.stringify(response.data));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [guid]);

  useEffect(() => {
    const localData = localStorage.getItem("data");
    const localAtcCodeData = localStorage.getItem("atcCodeData");

    if (localData) {
      setData(JSON.parse(localData));
    }

    if (localAtcCodeData) {
      setAtcCodeData(JSON.parse(localAtcCodeData));
    }
  }, []);

  const columns = React.useMemo(
    () => [
      // { Header: "ID", accessor: "guid" },
      { Header: "Code", accessor: "code" },
      { Header: "Level Name", accessor: "levelName" },
      { Header: "Level Name (Arabic)", accessor: "levelNameAr" },
    ],
    []
  );

  const filteredData = React.useMemo(() => {
    const lowercaseSearchTerm = searchTerm
      ? searchTerm.toLowerCase().trim()
      : "";
    return data.filter((atc) => 
      // Check if any field contains the search term
       Object.values(atc).some((value) =>
        String(value).toLowerCase().includes(lowercaseSearchTerm)
      )
    );
  }, [data, searchTerm]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: filteredData }, useSortBy);

  return (
    <div className="container mx-auto pt-6 md:px-10 text-black-text dark:text-white-text">
      <div>
        <h2 className="text-2xl text-center font-bold mb-4">ATCs Table</h2>
        <div className="flex justify-between items-center pb-4 py-6">
          <input
            type="text"
            placeholder="Search by code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // onChange={handleChange}
            className="rounded-md dark:border-white-text text-black-text dark:text-white-text mb-4 bg-white-bg dark:bg-black-bg dark:focus:border-transparent outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
          />
          <Link to="/atc/new" className="med-btn-pri">
            New
          </Link>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto ">
            <table {...getTableProps()} className="w-full table-auto">
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        className="px-4 py-2 border font-normal w-20"
                      >
                        {column.render("Header")}
                        <span>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <FaSortDown />
                            ) : (
                              <FaSortUp />
                            )
                          ) : (
                            <FaSort />
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      className="hover:bg-gray-100 dark:hover:bg-black-contents"
                    >
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          className="border-b px-4 py-2"
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ATCsList;
