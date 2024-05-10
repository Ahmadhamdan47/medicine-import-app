import localforage from "localforage";
import { Link } from "react-router-dom";
import { useTable, useSortBy } from "react-table";
import React, { useState, useEffect } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

import Axios from "../../../../../api/axios";

const STORAGE_KEY = "countriesData";

const GeosList = () => {
  const [countriesData, setCountriesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const cachedData = localStorage.getItem(STORAGE_KEY);
        if (cachedData) {
          setCountriesData(JSON.parse(cachedData));
          setLoading(false);
        }

        const response = await Axios.get("/api/country/v1.0/countries");
        const countries = response.data;

        const updatedCountries = await Promise.all(
          countries.map(async (country) => {
            try {
              const governoratesResponse = await Axios.get(
                `/api/Governorates/v1.0/Governorates/${country.guid}`
              );
              const governoratesData = governoratesResponse.data;
              const {staticCountryGuid} = country;

              const updatedGovernorates = await Promise.all(
                governoratesData.map(async (governorate) => {
                  try {
                    const districtsResponse = await Axios.get(
                      `/api/District/v1.0/district/${governorate.guid}`
                    );
                    const districtsData = districtsResponse.data;

                    const updatedDistricts = await Promise.all(
                      districtsData.map(async (district) => {
                        try {
                          const citiesResponse = await Axios.get(
                            `/api/City/v1.0/City/${district.guid}`
                          );
                          const citiesData = citiesResponse.data;
                          return {
                            ...district,
                            citiesData,
                          };
                        } catch (error) {
                          console.log(
                            `Error fetching cities data for district ${district.code}:`,
                            error
                          );
                          return district;
                        }
                      })
                    );

                    return {
                      ...governorate,
                      districtsData: updatedDistricts,
                    };
                  } catch (error) {
                    console.log(
                      `Error fetching districts data for governorate ${governorate.code}:`,
                      error
                    );
                    return governorate;
                  }
                })
              );

              return {
                ...country,
                governoratesData: updatedGovernorates,
                staticCountryGuid,
              };
            } catch (error) {
              console.log(
                `Error fetching governorates data for country ${country.code}:`,
                error
              );
              return country;
            }
          })
        );

        setCountriesData(updatedCountries);
        setLoading(false);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCountries));
        localforage.setItem("countriesData", updatedCountries);
      } catch (error) {
        console.log("Error fetching countries data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const SelectColumnFilter = ({
    column: { filterValue, setFilter, preFilteredRows, id },
  }) => {
    const options = useMemo(() => {
      const options = new Set();
      preFilteredRows.forEach((row) => {
        options.add(row.values[id]);
      });
      return [...options];
    }, [id, preFilteredRows]);
  
    return (
      <select
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
      >
        <option value="">All</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  };
  

  const columns = React.useMemo(
    () => [
      { Header: "Country", accessor: "name", Filter: SelectColumnFilter },
      { Header: "Code", accessor: "code" },
      { Header: "Country ar", accessor: "nameAr" },
      { Header: "Governorate Code", accessor: "governoratesData[0].code" },
      { Header: "Governorate", accessor: "governoratesData[0].name" },
      { Header: "Governorate ar", accessor: "governoratesData[0].nameAr" },
      {
        Header: "District Code",
        accessor: "governoratesData[0].districtsData[0].code",
      },
      {
        Header: "District",
        accessor: "governoratesData[0].districtsData[0].name",
      },
      {
        Header: "District ar",
        accessor: "governoratesData[0].districtsData[0].nameAr",
      },
      {
        Header: "City Code",
        accessor: "governoratesData[0].districtsData[0].citiesData[0].code",
      },
      {
        Header: "City",
        accessor: "governoratesData[0].districtsData[0].citiesData[0].name",
      },
      {
        Header: "City ar",
        accessor: "governoratesData[0].districtsData[0].citiesData[0].nameAr",
      },
    ],
    []
  );

  const filteredCountries = React.useMemo(() => {
    const lowercaseSearchTerm = searchTerm
      ? searchTerm.toLowerCase().trim()
      : "";
    return countriesData.filter((country) => 
      // Check if any field contains the search term
       Object.values(country).some((value) =>
        String(value).toLowerCase().includes(lowercaseSearchTerm)
      )
    );
  }, [countriesData, searchTerm]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    useFilters,
  } = useTable({ columns, data: filteredCountries }, useSortBy);

  return (
    <div className="container mx-auto pt-10 md:px-10 text-black-text dark:text-white-text">
      <h2 className="text-2xl text-center font-bold mb-4">
        Countries Info List
      </h2>
      <div className="flex justify-between items-center pb-4 py-6">
        <input
          label="Search countries"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoComplete="off"
          className="rounded-md dark:border-white-text text-black-text dark:text-white-text bg-white-bg dark:bg-black-bg dark:focus:border-transparent outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
        />

        <Link to="/geo/new" className="med-btn-pri">
          New
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-green-pri absolute top-80 right-50 h-20 w-20" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table {...getTableProps()} className="min-w-full table-auto">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="border border-gray-300 p-2 dark:border-black-contents p-2"
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
                      <div>
                        {column.canFilter ? column.render("Filter") : null}
                      </div>
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
                    className="border text-center border-gray-300 p-2 dark:border-black-contents dark:hover:bg-black-contents"
                  >
                    {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          className="border-b border-gray-300 p-2 dark:border-black-contents"
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
  );
};

export default GeosList;
