// import React, { useState, useContext } from "react";
// import Axios from "../../../../../api/axios";
// import { v4 as uuidv4 } from "uuid";
// import "./GeoForm.css";

// // Create a context to manage form data
// const GeoFormContext = React.createContext();

// const GeoForm = () => {
//   const [code, setCode] = useState("");
//   const [englishName, setEnglishName] = useState("");
//   const [arabicName, setArabicName] = useState("");
//   const [governorates, setGovernorates] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     const countryGuid = uuidv4();
//     const countryData = {
//       guid: countryGuid,
//       code: code,
//       name: englishName,
//       nameAr: arabicName,
//       enabled: true,
//       createdDate: new Date().toISOString(),
//     };

//     try {
//       // Post country data to its endpoint
//       await Axios.post("/api/country/v1.0", countryData);
//       console.log("Country data posted successfully:", countryData);

//       // Post governorates, districts, and cities data
//       await Promise.all(
//         governorates.map(async (governorate) => {
//           const governorateGuid = uuidv4();
//           await Axios.post("/api/governorates/v1.0", {
//             guid: governorateGuid,
//             code: governorate.code,
//             name: governorate.name,
//             nameAr: governorate.nameAr,
//             enabled: true,
//             createdDate: new Date().toISOString(),
//             staticCountryGuid: countryGuid,
//           });
//           console.log("Governorate data posted successfully");

//           return Promise.all(
//             governorate.districts.map(async (district) => {
//               const districtGuid = uuidv4();
//               await Axios.post("/api/district/v1.0", {
//                 guid: districtGuid,
//                 code: district.code,
//                 name: district.name,
//                 nameAr: district.nameAr,
//                 enabled: true,
//                 createdDate: new Date().toISOString(),
//                 governorateGuid: governorateGuid,
//               });
//               console.log("District data posted successfully");

//               return Promise.all(
//                 district.cities.map(async (city) => {
//                   await Axios.post("/api/city/v1.0", {
//                     guid: uuidv4(),
//                     code: city.code,
//                     name: city.name,
//                     nameAr: city.nameAr,
//                     enabled: true,
//                     createdDate: new Date().toISOString(),
//                     districtGuid: districtGuid,
//                   });
//                   console.log("City data posted successfully");
//                 })
//               );
//             })
//           );
//         })
//       );
//       setSuccessMessage("Data submitted successfully!");
//     } catch (error) {
//       console.error("Error posting data:", error);
//       setError("Error submitting data. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const addGovernorate = () => {
//     setGovernorates([
//       ...governorates,
//       { code: "", name: "", nameAr: "", districts: [] },
//     ]);
//   };

//   const addDistrict = (index) => {
//     const updatedGovernorates = [...governorates];
//     updatedGovernorates[index].districts.push({
//       code: "",
//       name: "",
//       nameAr: "",
//       cities: [],
//     });
//     setGovernorates(updatedGovernorates);
//   };

//   const addCity = (govIndex, distIndex) => {
//     const updatedGovernorates = [...governorates];
//     updatedGovernorates[govIndex].districts[distIndex].cities.push({
//       code: "",
//       name: "",
//       nameAr: "",
//     });
//     setGovernorates(updatedGovernorates);
//   };

//   const handleGovernorateChange = (index, field, value) => {
//     const updatedGovernorates = [...governorates];
//     updatedGovernorates[index][field] = value;
//     setGovernorates(updatedGovernorates);
//   };

//   const handleDistrictChange = (govIndex, distIndex, field, value) => {
//     const updatedGovernorates = [...governorates];
//     updatedGovernorates[govIndex].districts[distIndex][field] = value;
//     setGovernorates(updatedGovernorates);
//   };

//   const handleCityChange = (govIndex, distIndex, cityIndex, field, value) => {
//     const updatedGovernorates = [...governorates];
//     updatedGovernorates[govIndex].districts[distIndex].cities[cityIndex][
//       field
//     ] = value;
//     setGovernorates(updatedGovernorates);
//   };

//   return (
//     <GeoFormContext.Provider
//       value={{
//         governorates,
//         addGovernorate,
//         addDistrict,
//         addCity,
//         handleGovernorateChange,
//         handleDistrictChange,
//         handleCityChange,
//       }}
//     >
//       <form className="geo-form" onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="code">Country Code:</label>
//           <input
//             type="text"
//             id="code"
//             value={code}
//             onChange={(e) => setCode(e.target.value)}
//           />
//         </div>
//         <div>
//           <label htmlFor="englishName">Country English Name:</label>
//           <input
//             type="text"
//             id="englishName"
//             value={englishName}
//             onChange={(e) => setEnglishName(e.target.value)}
//           />
//         </div>
//         <div>
//           <label htmlFor="arabicName">Country Arabic Name:</label>
//           <input
//             type="text"
//             id="arabicName"
//             value={arabicName}
//             onChange={(e) => setArabicName(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Governorates:</label>
//           <GeoFormContext.Consumer>
//             {(context) => (
//               <>
//                 {context.governorates.map((governorate, govIndex) => (
//                   <div key={govIndex}>
//                     <input
//                       type="text"
//                       placeholder="Governorate Code"
//                       value={governorate.code}
//                       onChange={(e) =>
//                         context.handleGovernorateChange(
//                           govIndex,
//                           "code",
//                           e.target.value
//                         )
//                       }
//                     />
//                     <input
//                       type="text"
//                       placeholder="Name (English)"
//                       value={governorate.name}
//                       onChange={(e) =>
//                         context.handleGovernorateChange(
//                           govIndex,
//                           "name",
//                           e.target.value
//                         )
//                       }
//                     />
//                     <input
//                       type="text"
//                       placeholder="Name (Arabic)"
//                       value={governorate.nameAr}
//                       onChange={(e) =>
//                         context.handleGovernorateChange(
//                           govIndex,
//                           "nameAr",
//                           e.target.value
//                         )
//                       }
//                     />
//                     <div>
//                       <label>Districts:</label>
//                       {governorate.districts.map((district, distIndex) => (
//                         <div key={distIndex}>
//                           <input
//                             type="text"
//                             placeholder="District Code"
//                             value={district.code}
//                             onChange={(e) =>
//                               context.handleDistrictChange(
//                                 govIndex,
//                                 distIndex,
//                                 "code",
//                                 e.target.value
//                               )
//                             }
//                           />
//                           <input
//                             type="text"
//                             placeholder="Name (English)"
//                             value={district.name}
//                             onChange={(e) =>
//                               context.handleDistrictChange(
//                                 govIndex,
//                                 distIndex,
//                                 "name",
//                                 e.target.value
//                               )
//                             }
//                           />
//                           <input
//                             type="text"
//                             placeholder="Name (Arabic)"
//                             value={district.nameAr}
//                             onChange={(e) =>
//                               context.handleDistrictChange(
//                                 govIndex,
//                                 distIndex,
//                                 "nameAr",
//                                 e.target.value
//                               )
//                             }
//                           />
//                           <div>
//                             <label>Cities:</label>
//                             {district.cities.map((city, cityIndex) => (
//                               <div key={cityIndex}>
//                                 <input
//                                   type="text"
//                                   placeholder="City Code"
//                                   value={city.code}
//                                   onChange={(e) =>
//                                     context.handleCityChange(
//                                       govIndex,
//                                       distIndex,
//                                       cityIndex,
//                                       "code",
//                                       e.target.value
//                                     )
//                                   }
//                                 />
//                                 <input
//                                   type="text"
//                                   placeholder="Name (English)"
//                                   value={city.name}
//                                   onChange={(e) =>
//                                     context.handleCityChange(
//                                       govIndex,
//                                       distIndex,
//                                       cityIndex,
//                                       "name",
//                                       e.target.value
//                                     )
//                                   }
//                                 />
//                                 <input
//                                   type="text"
//                                   placeholder="Name (Arabic)"
//                                   value={city.nameAr}
//                                   onChange={(e) =>
//                                     context.handleCityChange(
//                                       govIndex,
//                                       distIndex,
//                                       cityIndex,
//                                       "nameAr",
//                                       e.target.value
//                                     )
//                                   }
//                                 />
//                               </div>
//                             ))}
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 context.addCity(govIndex, distIndex)
//                               }
//                             >
//                               Add City
//                             </button>
//                           </div>
//                         </div>
//                       ))}
//                       <button
//                         type="button"
//                         onClick={() => context.addDistrict(govIndex)}
//                       >
//                         Add District
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//                 <button type="button" onClick={context.addGovernorate}>
//                   Add Governorate
//                 </button>
//               </>
//             )}
//           </GeoFormContext.Consumer>
//         </div>
//         {error && <div className="error-message">{error}</div>}
//         {successMessage && (
//           <div className="success-message">{successMessage}</div>
//         )}

//         <button type="submit" disabled={isLoading}>
//           {isLoading ? "Submitting..." : "Submit"}
//         </button>
//       </form>
//     </GeoFormContext.Provider>
//   );
// };

// export default GeoForm;

import React from "react";
import { v4 as uuidv4 } from "uuid";

import "./GeoForm.css";
import { useGeoFormContext } from "./GeoFormContext";

const GeosForm = () => {
  const {
    englishName,
    arabicName,
    governorates,
    setGovernorates,
    districts,
    setDistricts,
    cities,
    setCities,
    handleSubmit,
    code,
    setCode,
    setEnglishName,
    setArabicName,
    isLoading,
    toggleGovernorateModal,
    showGovernorateModal,
    handleAddGovernorate,
    showDistrictModal,
    showCityModal,
    error,
    successMessage,
    // Add other context values as needed
  } = useGeoFormContext();

  return (
    <>
      <form className="geo-form" onSubmit={(e) => handleSubmit(e, uuidv4())}>
        <div>
          <label htmlFor="code">Country Code:</label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="englishName">Country English Name:</label>
          <input
            type="text"
            id="englishName"
            value={englishName}
            onChange={(e) => setEnglishName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="arabicName">Country Arabic Name:</label>
          <input
            type="text"
            id="arabicName"
            value={arabicName}
            onChange={(e) => setArabicName(e.target.value)}
          />
        </div>
        <button type="button" onClick={toggleGovernorateModal}>
          {showGovernorateModal ? "Close" : "Add Governorate"}
        </button>
        {error && <div className="error-message">{error}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {/* Governorate Modal */}
      {showGovernorateModal && (
        <div className="modal">
          <form>
            <input
              type="text"
              placeholder="Governorate Code"
              value={governorates.code}
              onChange={(e) =>
                context.handleGovernorateChange(
                  govIndex,
                  "code",
                  e.target.value
                )
              }
            />
            <input
              type="text"
              placeholder="Name (English)"
              value={governorates.name}
              onChange={(e) =>
                context.handleGovernorateChange(
                  govIndex,
                  "name",
                  e.target.value
                )
              }
            />
            <input
              type="text"
              placeholder="Name (Arabic)"
              value={governorates.nameAr}
              onChange={(e) =>
                context.handleGovernorateChange(
                  govIndex,
                  "nameAr",
                  e.target.value
                )
              }
            />
            <button type="button" onClick={toggleGovernorateModal}>
              Close
            </button>
            <button type="button" onClick={handleAddGovernorate}>
              Add Governorate
            </button>
          </form>
        </div>
      )}
      {/* District Modal */}
      {showDistrictModal && (
        <div className="modal">
          <form>
            <input
              type="text"
              placeholder="District Code"
              value={districts.code}
              onChange={(e) =>
                context.handleDistrictChange(
                  govIndex,
                  distIndex,
                  "code",
                  e.target.value
                )
              }
            />
            <input
              type="text"
              placeholder="Name (English)"
              value={district.name}
              onChange={(e) =>
                context.handleDistrictChange(
                  govIndex,
                  distIndex,
                  "name",
                  e.target.value
                )
              }
            />
            <input
              type="text"
              placeholder="Name (Arabic)"
              value={district.nameAr}
              onChange={(e) =>
                context.handleDistrictChange(
                  govIndex,
                  distIndex,
                  "nameAr",
                  e.target.value
                )
              }
            />
            <button type="button" onClick={addCity}>
              Add City
            </button>
          </form>
        </div>
      )}
      {/* City Modal */}
      {showCityModal && (
        <div className="modal">
          <form>
            <label>Cities:</label>
            {districts.map((district, districtIndex) => (
              <div key={districtIndex}>
                {district.cities.map((city, cityIndex) => (
                  <div key={cityIndex}>
                    <input
                      type="text"
                      placeholder="City Code"
                      value={city.code}
                      onChange={(e) =>
                        setCities((prevCities) => {
                          const newCities = [...prevCities];
                          newCities[districtIndex][cityIndex].code =
                            e.target.value;
                          return newCities;
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Name (English)"
                      value={city.name}
                      onChange={(e) =>
                        setCities((prevCities) => {
                          const newCities = [...prevCities];
                          newCities[districtIndex][cityIndex].name =
                            e.target.value;
                          return newCities;
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Name (Arabic)"
                      value={city.nameAr}
                      onChange={(e) =>
                        setCities((prevCities) => {
                          const newCities = [...prevCities];
                          newCities[districtIndex][cityIndex].nameAr =
                            e.target.value;
                          return newCities;
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            ))}
            <button type="button" onClick={() => addCity(govIndex, distIndex)}>
              Add City
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default GeosForm;
