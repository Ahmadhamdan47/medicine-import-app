import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import React, { useMemo, useState, useEffect } from "react";

import "../../../../index.css";
import { AddIcon } from "./AddIcon";

const StaticDataTable = ({
  title,
  createBtnLabel,
  createBtnUrl,
  onCreateBtnClick,
  data,
  columns,
  initialSortConfig,
  tableClasses,
  headerClasses,
  rowClasses,
  
}) => {
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState(initialSortConfig);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // const sortedDataMemoized = useMemo(() => {
  //   if (sortConfig.key !== null) {
  //     return [...data].sort((a, b) => {
  //       const valueA = a[sortConfig.key];
  //       const valueB = b[sortConfig.key];
  //       if (typeof valueA === "string" && typeof valueB === "string") {
  //         return valueA.toLowerCase() < valueB.toLowerCase()
  //           ? sortConfig.direction === "asc"
  //             ? -1
  //             : 1
  //           : valueA.toLowerCase() > valueB.toLowerCase()
  //           ? sortConfig.direction === "asc"
  //             ? 1
  //             : -1
  //           : 0;
  //       }
  //       return 0;
  //     });
  //   }
  //   return data;
  // }, [data, sortConfig]);

  const filteredData = useMemo(() => sortedData.filter((item) => columns.some((column) => {
        const value = item[column.key];
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      })), [data, columns, searchTerm]);

  return (
    <div className="px-2 lg:px-10 text-black-text dark:text-white-text">
      <h2 className="text-center text-green-pri">{title}</h2>
      <div className="flex justify-between items-center lg:pr-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-md py-1 px-3 dark:border-white-text text-black-text dark:text-white-text bg-white-bg dark:bg-black-bg dark:focus:border-transparent outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri mb-4"
        />

        {onCreateBtnClick ? (
          <button onClick={onCreateBtnClick} className="icon-hovered button-with-icon">
            <AddIcon />
            {createBtnLabel}
          </button>
        ) : (
          <Link to={createBtnUrl}>{createBtnLabel}</Link>
        )}
      </div>
      <table
        className={`w-full table-auto border border-collapse mt-2 ${tableClasses}`}
      >
        <thead
          className={`select-none h-10 sticky top-0 z-30 bg-gray-200 dark:bg-black-input font-normal ${headerClasses}`}
        >
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="relative"
                onClick={() => requestSort(column.key)}
              >
                <div className="cursor-pointer">
                  {column.name}
                  {sortConfig.key === column.key && (
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                      {sortConfig.direction === "asc" ? (
                        <FaSortDown />
                      ) : (
                        <FaSortUp />
                      )}
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-center overflow-y-auto z-0">
          {filteredData.map((item, index) => (
            <tr
              key={index}
              className={`border-b hover:bg-white-contents dark:hover:bg-black-contents ${rowClasses}`}
            >
              {columns.map((column, columnIndex) => (
                <td key={columnIndex} className="py-2 px-4">
                  {item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

StaticDataTable.propTypes = {
  title: PropTypes.string.isRequired,
  createBtnLabel: PropTypes.string.isRequired,
  createBtnUrl: PropTypes.string.isRequired, // Dynamic URL for the button/link
  onCreateBtnClick: PropTypes.func, // This is now optional
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  initialSortConfig: PropTypes.object.isRequired,
  tableClasses: PropTypes.string,
  headerClasses: PropTypes.string,
  rowClasses: PropTypes.string,
};

StaticDataTable.defaultProps = {
  initialSortConfig: { key: null, direction: "asc" },
  tableClasses: "",
  headerClasses: "",
  rowClasses: "",
};

export default StaticDataTable;
