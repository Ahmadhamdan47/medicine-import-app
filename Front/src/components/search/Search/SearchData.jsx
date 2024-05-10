// import React from "react";
// import { switcharabic } from "../../../images";

// const SearchData = (props) => {
//   const { filteredData } = props;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//       {filteredData.map((drug) => (
//         <div
//           key={drug.id}
//           className="search-data-box p-4 border-2 border-secondary rounded-md mb-8"
//         >
//           <div className="flex flex-col items-center mb-4">
//             <h3 className="text-lg font-bold mb-2">{drug.name}</h3>
//             <h6 className="text-sm text-hamburger">{drug.drugNameXmg}</h6>
//           </div>
//           <div className="flex flex-col space-y-2">
//             {drug.dose && (
//               <div className="flex items-center">
//                 <div className="font-bold mr-2">Dose:</div>
//                 <div className="text-primary">{drug.dose}</div>
//               </div>
//             )}
//             {drug.presentation && (
//               <div className="flex items-center">
//                 <div className="font-bold mr-2">Presentation:</div>
//                 <div className="text-primary">{drug.presentation}</div>
//               </div>
//             )}
//             {drug.form && (
//               <div className="flex items-center">
//                 <div className="font-bold mr-2">Form:</div>
//                 <div className="text-primary">{drug.form}</div>
//               </div>
//             )}
//             {drug.route && (
//               <div className="flex items-center">
//                 <div className="font-bold mr-2">Route:</div>
//                 <div className="text-primary">{drug.route}</div>
//               </div>
//             )}
//             {drug.type && (
//               <div className="flex items-center">
//                 <div className="font-bold mr-2">Type:</div>
//                 <div className="text-primary">{drug.type}</div>
//               </div>
//             )}
//           </div>

//           {drug.substituteAvailable && (
//             <div className="source-subtitute-row flex items-center justify-between mt-4">
//               <ul>
//                 <li>{/* Display your substitute data here */}</li>
//               </ul>
//               <button className="bg-secondary text-white py-2 px-4 rounded-md cursor-pointer">
//                 Substitute
//               </button>
//             </div>
//           )}

//           <div className="made-price-row flex items-center justify-between mt-4">
//             <div>
//               <p>{/* Display additional data here */}</p>
//               {/* <img src={switcharabic} alt="Switch Arabic" /> */}
//             </div>
//             <div className="text-hamburger font-bold">{drug.price}</div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SearchData;


// // //////////////////////////////////////////////////////////////////



// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { HiPencilAlt, HiTrash } from "react-icons/hi";
// import panadol from "../../../images/panadol.png";
// import lebflag from "../../../images/lebflag.png";
// import subs2 from "../../../images/subs2.png";
// import "../../../index.css";

// function SearchData({ filteredData }) {
  
//   const [drugs, setDrugs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   async function loadDrugs() {
//     try {
//       const res = await axios.get("http://1.1.1.250:3500/drugs");
//       setDrugs(res.data.reverse());
//       setLoading(false);
//     } catch (error) {
//       console.error("There's a problem listing the medications:", error);
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       await loadDrugs();
//     };

//     fetchData();
//   }, []);

//   function deleteDrug(id) {
//     axios
//       .delete(`http://1.1.1.250:3500/drugs/${id}`)
//       .then(() => loadDrugs());
//   }

//   return (
//     <div className="flex flex-col sm:p-4">
//       {loading ? (
//         <p>Loading...</p>
//       ) : drugs.length === 0 ? (
//         <p className="mb-4 text-2xl text-gray-600">
//           No Drugs Data Available. Click
//           <Link
//             to="/add"
//             className="font-semibold text-teal-600 hover:underline mx-2"
//           >
//             Add
//           </Link>
//           to create a new drug.
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 gap-14 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
//           {drugs.map((data, index) => {
//             return (
//               <div
//                 key={index}
//                 className="card w-full overflow-hidden bg-white-fg dark:bg-black-input rounded-3xl border-2 border-[#00a651] outline-none hover:border-green-pri hover:outline-none hover:ring-2 hover:ring-green-pri dark:hover:ring-2 dark:hover:ring-green-pri p- shadow-xl transition duration-300 hover:scale-105 hover:shadow-2xl dark:text-white-text dark:shadow-lg dark:shadow-[#24382ab0]" // Adjust the width here
//               >
//                 <Link
//                   to={data._id ? `/viewdrug/${data._id}` : "/"}
//                   className="text-black-text no-underline bg-black-bg dark:bg-black-bg dark:text-white-text"
//                 >
//                   <div className="flex">
//                     <div className="flex w-2/5 flex-col">
//                       {/* Adjust the width here */}
//                       <div className="w-full">
//                         {/* Check if images array exists and has length */}
//                         {data.drugImages && data.drugImages.length > 0 ? (
//                           // Display the first image dynamically
//                           <img
//                             src={data.drugImages[0].imageUrl}
//                             alt={`Drug ${index + 1}`}
//                             className="h-44 w-full object-contain"
//                             onLoad={() =>
//                               console.log(
//                                 `Image loaded for Drug ${index + 1}:`,
//                                 data.drugImages[0].imageUrl
//                               )
//                             }
//                             onError={(e) =>
//                               console.error(
//                                 `Error loading image for Drug ${index + 1}:`,
//                                 e
//                               )
//                             }
//                           />
//                         ) : (
//                           // Display a placeholder image if no images are available
//                           <img
//                             src={lebflag}
//                             alt={`Drug ${index + 1}`}
//                             className="h-44 w-full object-contain"
//                             onLoad={() =>
//                               console.log(
//                                 `Placeholder image loaded for Drug ${index + 1}`
//                               )
//                             }
//                             onError={() =>
//                               console.error(
//                                 `Error loading placeholder image for Drug ${
//                                   index + 1
//                                 }`
//                               )
//                             }
//                           />
//                         )}
//                       </div>
//                       <div className="w-full pr-8 sm:pr-12 md:pr-[70px] lg:pr-5 xl:pr-[72px]">
//                         <p className="text-md text-right text-[#00a651]">
//                           {data.convertToLBP} LBP
//                         </p>
//                       </div>
//                       <div className="w-full pr-8 sm:pr-12  md:pr-[70px] lg:pr-5 xl:pr-[72px]">
//                         <p className="text-md text-right text-[#00a651]">
//                           {data.convertToUSD} USD
//                         </p>
//                       </div>
//                       <div className="w-full pr-8 sm:pr-12  md:pr-[70px] lg:pr-5 xl:pr-[72px]">
//                         <p className="text-md text-right text-[#00a651]">
//                           {data.pillPriceLB} LBP/Pill
//                         </p>
//                       </div>
//                     </div>

//                     <div className="w-3/5 p-4 text-left">
//                       {/* Adjust the width here */}
//                       <h2 className="mb-2 text-2xl font-semibold">
//                         {data.drugName}
//                       </h2>
//                       <p className="mb-2 text-sm italic text-gray-600 dark:text-gray-400">
//                         {data.ingredientsAndstrength}
//                         <span className="ml-1">
//                           <span className="mr-1">{data.dosageValueN}</span>
//                           <span className="">{data.dosageUnitN}</span>
//                         </span>
//                       </p>
//                       <p className="font-bold">
//                         <span className="font-normal mr-1">Dose:</span>
//                         <span className="mr-1">{data.dosageValueN}</span>
//                         <span className="">{data.dosageUnitN}</span>
//                       </p>
//                       <p className="font-bold">
//                         <span className="font-normal mr-1">Presentation: </span>
//                         {data.presentationContentQty}
//                       </p>
//                       <p className="font-bold">
//                         <span className="font-normal mr-1">Form: </span>
//                         {data.form}
//                       </p>
//                       <p className="font-bold">
//                         <span className="font-normal mr-1">Route: </span>
//                         {data.route}
//                       </p>
//                       <p className="font-bold">
//                         <span className="font-normal mr-1">Type: </span>
//                         {data.type}
//                       </p>
//                     </div>
//                   </div>
//                 </Link>
//                 <div className="flex items-center w-full justify-between bg-white-contents p-1 sm:px-3 pr-2">
//                   <div className="edit-delete flex flex-col sm:flex-row">
//                     <Link
//                       to={data._id ? `/editdrug/${data._id}` : "/"}
//                       className={`text-teal-600 hover:underline ${
//                         !data._id ? "cursor-not-allowed" : ""
//                       }`}
//                     >
//                       <HiPencilAlt className="mr-2 inline-block" />
//                       Edit
//                     </Link>
//                     <button
//                       onClick={() => deleteDrug(data._id)}
//                       className="ml-2 text-red-600 hover:underline"
//                     >
//                       <HiTrash className="mr-2 inline-block" />
//                       Delete
//                     </button>
//                   </div>
//                   <div className="flex items-center justify-around">
//                     <Link to="/substitute">
//                       <img
//                         src={subs2}
//                         className="w-[120px] cursor-pointer"
//                         alt=""
//                       ></img>
//                     </Link>
//                   </div>
//                   <div className="flex flex-col-reverse sm:flex-row w-fit items-center justify-center gap-1">
//                     <p className=" text-xs text-black-text">Made in Lebanon</p>
//                     <img className="w-[50px]" src={lebflag} alt=""></img>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// export default SearchData;


// import React from "react";
// import { Link } from "react-router-dom";
// import { HiPencilAlt, HiTrash } from "react-icons/hi";
// import { switcharabic } from "../../../images";
// import lebflag from "../../../images/lebflag.png";
// import subs2 from "../../../images/subs2.png";

// const SearchData = (props) => {
//   const { filteredData } = props;

//   const deleteDrug = (id) => {
//     // Your delete logic here
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//       {filteredData.map((data, index) => (
//         <div
//           key={index}
//           className="card w-full overflow-hidden bg-white-fg dark:bg-black-input rounded-3xl border-2 border-[#00a651] outline-none hover:border-green-pri hover:outline-none hover:ring-2 hover:ring-green-pri dark:hover:ring-2 dark:hover:ring-green-pri p- shadow-xl transition duration-300 hover:scale-105 hover:shadow-2xl dark:text-white-text dark:shadow-lg dark:shadow-[#24382ab0]"
//         >
//           <Link
//             to={data._id ? `/viewdrug/${data._id}` : "/"}
//             className="text-black-text no-underline bg-black-bg dark:bg-black-bg dark:text-white-text"
//           >
//             <div className="flex">
//               <div className="flex w-2/5 flex-col">
//                 <div className="w-full">
//                   {data.drugImages && data.drugImages.length > 0 ? (
//                     <img
//                       src={data.drugImages[0].imageUrl}
//                       alt={`Drug ${index + 1}`}
//                       className="h-44 w-full object-contain"
//                       onLoad={() =>
//                         console.log(
//                           `Image loaded for Drug ${index + 1}:`,
//                           data.drugImages[0].imageUrl
//                         )
//                       }
//                       onError={(e) =>
//                         console.error(
//                           `Error loading image for Drug ${index + 1}:`,
//                           e
//                         )
//                       }
//                     />
//                   ) : (
//                     <img
//                       src={lebflag}
//                       alt={`Drug ${index + 1}`}
//                       className="h-44 w-full object-contain"
//                       onLoad={() =>
//                         console.log(
//                           `Placeholder image loaded for Drug ${index + 1}`
//                         )
//                       }
//                       onError={() =>
//                         console.error(
//                           `Error loading placeholder image for Drug ${index + 1}`
//                         )
//                       }
//                     />
//                   )}
//                 </div>
//                 <div className="w-full pr-8 sm:pr-12 md:pr-[70px] lg:pr-5 xl:pr-[72px]">
//                   <p className="text-md text-right text-[#00a651]">
//                     {data.convertToLBP} LBP
//                   </p>
//                 </div>
//                 <div className="w-full pr-8 sm:pr-12  md:pr-[70px] lg:pr-5 xl:pr-[72px]">
//                   <p className="text-md text-right text-[#00a651]">
//                     {data.convertToUSD} USD
//                   </p>
//                 </div>
//                 <div className="w-full pr-8 sm:pr-12  md:pr-[70px] lg:pr-5 xl:pr-[72px]">
//                   <p className="text-md text-right text-[#00a651]">
//                     {data.pillPriceLB} LBP/Pill
//                   </p>
//                 </div>
//               </div>

//               <div className="w-3/5 p-4 text-left">
//                 <h2 className="mb-2 text-2xl font-semibold">
//                   {data.drugName}
//                 </h2>
//                 <p className="mb-2 text-sm italic text-gray-600 dark:text-gray-400">
//                   {data.ingredientsAndstrength}
//                   <span className="ml-1">
//                     <span className="mr-1">{data.dosageValueN}</span>
//                     <span className="">{data.dosageUnitN}</span>
//                   </span>
//                 </p>
//                 <p className="font-bold">
//                   <span className="font-normal mr-1">Dose:</span>
//                   <span className="mr-1">{data.dosageValueN}</span>
//                   <span className="">{data.dosageUnitN}</span>
//                 </p>
//                 <p className="font-bold">
//                   <span className="font-normal mr-1">Presentation: </span>
//                   {data.presentationContentQty}
//                 </p>
//                 <p className="font-bold">
//                   <span className="font-normal mr-1">Form: </span>
//                   {data.form}
//                 </p>
//                 <p className="font-bold">
//                   <span className="font-normal mr-1">Route: </span>
//                   {data.route}
//                 </p>
//                 <p className="font-bold">
//                   <span className="font-normal mr-1">Type: </span>
//                   {data.type}
//                 </p>
//               </div>
//             </div>
//           </Link>
//           <div className="flex items-center w-full justify-between bg-white-contents p-1 sm:px-3 pr-2">
//             <div className="edit-delete flex flex-col sm:flex-row">
//               <Link
//                 to={data._id ? `/editdrug/${data._id}` : "/"}
//                 className={`text-teal-600 hover:underline ${
//                   !data._id ? "cursor-not-allowed" : ""
//                 }`}
//               >
//                 <HiPencilAlt className="mr-2 inline-block" />
//                 Edit
//               </Link>
//               <button
//                 onClick={() => deleteDrug(data._id)}
//                 className="ml-2 text-red-600 hover:underline"
//               >
//                 <HiTrash className="mr-2 inline-block" />
//                 Delete
//               </button>
//             </div>
//             <div className="flex items-center justify-around">
//               <Link to="/substitute">
//                 <img
//                   src={subs2}
//                   className="w-[120px] cursor-pointer"
//                   alt=""
//                 ></img>
//               </Link>
//             </div>
//             <div className="flex flex-col-reverse sm:flex-row w-fit items-center justify-center gap-1">
//               <p className="text-xs text-black-text">Made in Lebanon</p>
//               <img className="w-[50px]" src={lebflag} alt=""></img>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SearchData;




import React from "react";
import { Link } from "react-router-dom";
import { HiTrash, HiPencilAlt } from "react-icons/hi";

import "../../../index.css";
import subs2 from "../../../images/subs2.png";
import lebflag from "../../../images/lebflag.png";

function SearchData({ filteredData }) {
  return (
    <div className="flex flex-col sm:p-4">
      {filteredData.length === 0 ? (
        <p className="mb-4 text-2xl text-gray-600">
          No Drugs Data Available.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-14 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {filteredData.map((data, index) => (
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
                    <div className="w-full">
                      {data.drugImages && data.drugImages.length > 0 ? (
                        <img
                          src={data.drugImages[0].imageUrl}
                          alt={`Drug ${index + 1}`}
                          className="h-44 w-full object-contain"
                          onLoad={() =>
                            console.log(
                              `Image loaded for Drug ${index + 1}:`,
                              data.drugImages[0].imageUrl
                            )
                          }
                          onError={(e) =>
                            console.error(
                              `Error loading image for Drug ${index + 1}:`,
                              e
                            )
                          }
                        />
                      ) : (
                        <img
                          src={lebflag}
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
                    <div className="w-full pr-8 sm:pr-12 md:pr-[70px] lg:pr-5 xl:pr-[72px]">
                      <p className="text-md text-right text-[#00a651]">
                        {data.convertToLBP} LBP
                      </p>
                    </div>
                    <div className="w-full pr-8 sm:pr-12  md:pr-[70px] lg:pr-5 xl:pr-[72px]">
                      <p className="text-md text-right text-[#00a651]">
                        {data.convertToUSD} USD
                      </p>
                    </div>
                    <div className="w-full pr-8 sm:pr-12  md:pr-[70px] lg:pr-5 xl:pr-[72px]">
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

export default SearchData;

