// // import React, { useState, useEffect } from "react";
// // import Axios from "../../../../../api/axios";
// // import localforage from "localforage";
// // import { useTable, useSortBy } from "react-table";
// // import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa"; // Import the icons
// // import { Link } from "react-router-dom";

// // const STORAGE_KEY = "countriesData"; // Define a storage key

// // const GeosList = () => {
// //   const [countriesData, setCountriesData] = useState([]);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [loading, setLoading] = useState(true);

// //   // Retrieve accessToken from localStorage
// //   const accessToken = localStorage.getItem("accessToken");

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         let cachedData = localStorage.getItem(STORAGE_KEY);
// //         if (cachedData) {
// //           // If cached data exists, parse and set it
// //           setCountriesData(JSON.parse(cachedData));
// //           setLoading(false);
// //         } else {
// //           // const response = await Axios.get("/api/country/v1.0/countries", {
// //           //   headers: {
// //           //     Authorization: `Bearer ${accessToken}`,
// //           //   },
// //         }
// //         const response = await Axios.get("/api/country/v1.0/countries");
// //         const countries = response.data;
// //         const updatedCountries = await Promise.all(
// //           countries.map(async (country) => {
// //             try {
// //               const governoratesResponse = await Axios.get(
// //                 `/api/Governorates/v1.0/Governorates/${country.guid}`
// //               );
// //               const governoratesData = governoratesResponse.data;
// //               const staticCountryGuid = country.staticCountryGuid;

// //               const updatedGovernorates = await Promise.all(
// //                 governoratesData.map(async (governorate) => {
// //                   try {
// //                     const districtsResponse = await Axios.get(
// //                       `/api/District/v1.0/district/${governorate.guid}`
// //                     );
// //                     const districtsData = districtsResponse.data;
// //                     return {
// //                       ...governorate,
// //                       districtsData,
// //                     };
// //                   } catch (error) {
// //                     console.log(
// //                       `Error fetching districts data for governorate ${governorate.code}:`,
// //                       error
// //                     );
// //                     return governorate;
// //                   }
// //                 })
// //               );

// //               return {
// //                 ...country,
// //                 governoratesData: updatedGovernorates,
// //                 staticCountryGuid,
// //               };
// //             } catch (error) {
// //               console.log(
// //                 `Error fetching governorates data for country ${country.code}:`,
// //                 error
// //               );
// //               return country;
// //             }
// //           })
// //         );
// //         setCountriesData(updatedCountries);
// //         setLoading(false);
// //         localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCountries));
// //         // Store the fetched data in localforage
// //         localforage.setItem("countriesData", updatedCountries);

// //         // Store the fetched data in sessionStorage
// //         sessionStorage.setItem(
// //           "countriesData",
// //           JSON.stringify(updatedCountries)
// //         );
// //       } catch (error) {
// //         console.log("Error fetching countries data:", error);
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   const columns = React.useMemo(
// //     () => [
// //       { Header: "Name", accessor: "name" },
// //       { Header: "Code", accessor: "code" },
// //       { Header: "Name (Arabic)", accessor: "nameAr" },
// //       { Header: "Governorate Code", accessor: "governoratesData[0].code" },
// //       { Header: "Governorate Name", accessor: "governoratesData[0].name" },
// //       {
// //         Header: "Governorate Name (Arabic)",
// //         accessor: "governoratesData[0].nameAr",
// //       },
// //       {
// //         Header: "District Code",
// //         accessor: "governoratesData[0].districtsData[0].code",
// //       },
// //       {
// //         Header: "District Name",
// //         accessor: "governoratesData[0].districtsData[0].name",
// //       },
// //       {
// //         Header: "District Name (Arabic)",
// //         accessor: "governoratesData[0].districtsData[0].nameAr",
// //       },
// //     ],
// //     []
// //   );

// //   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
// //     useTable({ columns, data: countriesData }, useSortBy);

// //   const filteredCountries = countriesData.filter(
// //     (country) =>
// //       country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       country.code.toLowerCase().includes(searchTerm.toLowerCase())
// //   );

// //   return (
// //     <div className=" w-full mx-auto p-4 overflow-x-auto">
// //       <h2 className="text-2xl font-bold mb-4">Countries Info List</h2>
// //       <div className="flex justify-between items-center p-6">
// //         <input
// //           type="text"
// //           placeholder="Search..."
// //           className="border border-gray-500 p-2 mb-4"
// //           value={searchTerm}
// //           onChange={(e) => setSearchTerm(e.target.value)}
// //         />
// //         <Link to="/geo/new" className=" med-btn-pri">
// //           Add New
// //         </Link>
// //       </div>

// //       {loading ? (
// //         <div className="flex justify-center items-center">
// //           <div className="loader ease-linear rounded-full border-8 border-t-8 border-green-pri absolute top-80 right-50 h-20 w-20"></div>
// //         </div>
// //       ) : (
// //         <table
// //           {...getTableProps()}
// //           className="border-collapse border border-gray-500 w-full"
// //         >
// //           <thead>
// //             {headerGroups.map((headerGroup) => (
// //               <tr {...headerGroup.getHeaderGroupProps()}>
// //                 {headerGroup.headers.map((column) => (
// //                   <th
// //                     {...column.getHeaderProps(column.getSortByToggleProps())}
// //                     className="border border-gray-500 p-2"
// //                   >
// //                     {column.render("Header")}
// //                     <span>
// //                       {column.isSorted ? (
// //                         column.isSortedDesc ? (
// //                           <FaSortDown />
// //                         ) : (
// //                           <FaSortUp />
// //                         )
// //                       ) : (
// //                         <FaSort />
// //                       )}
// //                     </span>
// //                   </th>
// //                 ))}
// //               </tr>
// //             ))}
// //           </thead>
// //           <tbody {...getTableBodyProps()}>
// //             {rows.map((row) => {
// //               prepareRow(row);
// //               return (
// //                 <tr
// //                   {...row.getRowProps()}
// //                   className="border-b text-center border-gray-500"
// //                 >
// //                   {row.cells.map((cell) => {
// //                     return (
// //                       <td
// //                         {...cell.getCellProps()}
// //                         className="border-b border-gray-500 p-2"
// //                       >
// //                         {cell.render("Cell")}
// //                       </td>
// //                     );
// //                   })}
// //                 </tr>
// //               );
// //             })}
// //           </tbody>
// //         </table>
// //       )}
// //     </div>
// //   );
// // };

// // export default GeosList;



// ///////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////


// import React, { useState, useEffect } from "react";
// import Axios from "../../../../../api/axios";
// import localforage from "localforage";
// import { useTable, useSortBy } from "react-table";
// import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
// import { Link } from "react-router-dom";

// const STORAGE_KEY = "countriesData";

// const GeosList = () => {
//   const [countriesData, setCountriesData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         let cachedData = localStorage.getItem(STORAGE_KEY);
//         if (cachedData) {
//           setCountriesData(JSON.parse(cachedData));
//           setLoading(false);
//         }

//         const response = await Axios.get("/api/country/v1.0/countries");
//         const countries = response.data;

//         const updatedCountries = await Promise.all(
//           countries.map(async (country) => {
//             try {
//               const governoratesResponse = await Axios.get(
//                 `/api/Governorates/v1.0/Governorates/${country.guid}`
//               );
//               const governoratesData = governoratesResponse.data;
//               const staticCountryGuid = country.staticCountryGuid;

//               const updatedGovernorates = await Promise.all(
//                 governoratesData.map(async (governorate) => {
//                   try {
//                     const districtsResponse = await Axios.get(
//                       `/api/District/v1.0/district/${governorate.guid}`
//                     );
//                     const districtsData = districtsResponse.data;
//                     return {
//                       ...governorate,
//                       districtsData,
//                     };
//                   } catch (error) {
//                     console.log(
//                       `Error fetching districts data for governorate ${governorate.code}:`,
//                       error
//                     );
//                     return governorate;
//                   }
//                 })
//               );

//               return {
//                 ...country,
//                 governoratesData: updatedGovernorates,
//                 staticCountryGuid,
//               };
//             } catch (error) {
//               console.log(
//                 `Error fetching governorates data for country ${country.code}:`,
//                 error
//               );
//               return country;
//             }
//           })
//         );

//         setCountriesData(updatedCountries);
//         setLoading(false);
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCountries));
//         localforage.setItem("countriesData", updatedCountries);
//       } catch (error) {
//         console.log("Error fetching countries data:", error);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const columns = React.useMemo(
//     () => [
//       { Header: "Name", accessor: "name" },
//       { Header: "Code", accessor: "code" },
//       { Header: "Name (Arabic)", accessor: "nameAr" },
//       { Header: "Governorate Code", accessor: "governoratesData[0].code" },
//       { Header: "Governorate Name", accessor: "governoratesData[0].name" },
//       {
//         Header: "Governorate Name (Arabic)",
//         accessor: "governoratesData[0].nameAr",
//       },
//       {
//         Header: "District Code",
//         accessor: "governoratesData[0].districtsData[0].code",
//       },
//       {
//         Header: "District Name",
//         accessor: "governoratesData[0].districtsData[0].name",
//       },
//       {
//         Header: "District Name (Arabic)",
//         accessor: "governoratesData[0].districtsData[0].nameAr",
//       },
//     ],
//     []
//   );

//   const filteredCountries = React.useMemo(() => {
//     const lowercaseSearchTerm = searchTerm
//       ? searchTerm.toLowerCase().trim()
//       : "";
//     return countriesData.filter((country) => {
//       // Check if any field contains the search term
//       return Object.values(country).some((value) =>
//         String(value).toLowerCase().includes(lowercaseSearchTerm)
//       );
//     });
//   }, [countriesData, searchTerm]);

//   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
//     useTable({ columns, data: filteredCountries }, useSortBy);

//   return (
//     <div className="container mx-auto pt-10 md:px-10 text-black-text dark:text-white-text">
//       <h2 className="text-2xl text-center font-bold mb-4">
//         Countries Info List
//       </h2>
//       <div className="flex justify-between items-center pb-4 py-6">
//         <input
//           label="Search countries"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           autoComplete="off"
//           className="rounded-md dark:border-white-text text-black-text dark:text-white-text bg-white-bg dark:bg-black-bg dark:focus:border-transparent outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
//         />

//         <Link to="/geo/new" className="med-btn-pri">
//           New
//         </Link>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center">
//           <div className="loader ease-linear rounded-full border-8 border-t-8 border-green-pri absolute top-80 right-50 h-20 w-20"></div>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table
//             {...getTableProps()}
//             className="min-w-full table-auto"
//             // className="border-collapse border border-gray-300 w-full"
//           >
//             <thead>
//               {headerGroups.map((headerGroup) => (
//                 <tr {...headerGroup.getHeaderGroupProps()}>
//                   {headerGroup.headers.map((column) => (
//                     <th
//                       {...column.getHeaderProps(column.getSortByToggleProps())}
//                       className="border border-gray-300 p-2 dark:border-black-contents p-2"
//                     >
//                       {column.render("Header")}
//                       <span>
//                         {column.isSorted ? (
//                           column.isSortedDesc ? (
//                             <FaSortDown />
//                           ) : (
//                             <FaSortUp />
//                           )
//                         ) : (
//                           <FaSort />
//                         )}
//                       </span>
//                     </th>
//                   ))}
//                 </tr>
//               ))}
//             </thead>
//             <tbody {...getTableBodyProps()}>
//               {rows.map((row) => {
//                 prepareRow(row);
//                 return (
//                   <tr
//                     {...row.getRowProps()}
//                     className="border text-center border-gray-300 p-2 dark:border-black-contents dark:hover:bg-black-contents"
//                   >
//                     {row.cells.map((cell) => {
//                       return (
//                         <td
//                           {...cell.getCellProps()}
//                           className="border-b border-gray-300 p-2 dark:border-black-contents"
//                         >
//                           {cell.render("Cell")}
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GeosList;
