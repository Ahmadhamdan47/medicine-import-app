// import React, { useState } from "react";
// import Axios from "../../../../../api/axios";
// import { v4 as uuidv4 } from "uuid";
// import "./GeoForm.css";

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
//     <form className="geo-form" onSubmit={handleSubmit}>
//       <div>
//         <label htmlFor="code">Country Code:</label>
//         <input
//           type="text"
//           id="code"
//           value={code}
//           onChange={(e) => setCode(e.target.value)}
//         />
//       </div>
//       <div>
//         <label htmlFor="englishName">Country English Name:</label>
//         <input
//           type="text"
//           id="englishName"
//           value={englishName}
//           onChange={(e) => setEnglishName(e.target.value)}
//         />
//       </div>
//       <div>
//         <label htmlFor="arabicName">Country Arabic Name:</label>
//         <input
//           type="text"
//           id="arabicName"
//           value={arabicName}
//           onChange={(e) => setArabicName(e.target.value)}
//         />
//       </div>
//       <div>
//         <label>Governorates:</label>
//         {governorates.map((governorate, govIndex) => (
//           <div key={govIndex}>
//             <input
//               type="text"
//               placeholder="Governorate Code"
//               value={governorate.code}
//               onChange={(e) =>
//                 handleGovernorateChange(govIndex, "code", e.target.value)
//               }
//             />
//             <input
//               type="text"
//               placeholder="Name (English)"
//               value={governorate.name}
//               onChange={(e) =>
//                 handleGovernorateChange(govIndex, "name", e.target.value)
//               }
//             />
//             <input
//               type="text"
//               placeholder="Name (Arabic)"
//               value={governorate.nameAr}
//               onChange={(e) =>
//                 handleGovernorateChange(govIndex, "nameAr", e.target.value)
//               }
//             />
//             <div>
//               <label>Districts:</label>
//               {governorate.districts.map((district, distIndex) => (
//                 <div key={distIndex}>
//                   <input
//                     type="text"
//                     placeholder="District Code"
//                     value={district.code}
//                     onChange={(e) =>
//                       handleDistrictChange(
//                         govIndex,
//                         distIndex,
//                         "code",
//                         e.target.value
//                       )
//                     }
//                   />
//                   <input
//                     type="text"
//                     placeholder="Name (English)"
//                     value={district.name}
//                     onChange={(e) =>
//                       handleDistrictChange(
//                         govIndex,
//                         distIndex,
//                         "name",
//                         e.target.value
//                       )
//                     }
//                   />
//                   <input
//                     type="text"
//                     placeholder="Name (Arabic)"
//                     value={district.nameAr}
//                     onChange={(e) =>
//                       handleDistrictChange(
//                         govIndex,
//                         distIndex,
//                         "nameAr",
//                         e.target.value
//                       )
//                     }
//                   />
//                   <div>
//                     <label>Cities:</label>
//                     {district.cities.map((city, cityIndex) => (
//                       <div key={cityIndex}>
//                         <input
//                           type="text"
//                           placeholder="City Code"
//                           value={city.code}
//                           onChange={(e) =>
//                             handleCityChange(
//                               govIndex,
//                               distIndex,
//                               cityIndex,
//                               "code",
//                               e.target.value
//                             )
//                           }
//                         />
//                         <input
//                           type="text"
//                           placeholder="Name (English)"
//                           value={city.name}
//                           onChange={(e) =>
//                             handleCityChange(
//                               govIndex,
//                               distIndex,
//                               cityIndex,
//                               "name",
//                               e.target.value
//                             )
//                           }
//                         />
//                         <input
//                           type="text"
//                           placeholder="Name (Arabic)"
//                           value={city.nameAr}
//                           onChange={(e) =>
//                             handleCityChange(
//                               govIndex,
//                               distIndex,
//                               cityIndex,
//                               "nameAr",
//                               e.target.value
//                             )
//                           }
//                         />
//                       </div>
//                     ))}
//                     <button
//                       type="button"
//                       onClick={() => addCity(govIndex, distIndex)}
//                     >
//                       Add City
//                     </button>
//                   </div>
//                 </div>
//               ))}
//               <button type="button" onClick={() => addDistrict(govIndex)}>
//                 Add District
//               </button>
//             </div>
//           </div>
//         ))}
//         <button type="button" onClick={addGovernorate}>
//           Add Governorate
//         </button>
//       </div>
//       {error && <div className="error-message">{error}</div>}
//       {successMessage && (
//         <div className="success-message">{successMessage}</div>
//       )}

//       <button type="submit" disabled={isLoading}>
//         {isLoading ? "Submitting..." : "Submit"}
//       </button>
//     </form>
//   );
// };

// export default GeoForm;

// ////////////////////////////////
// ////////////////////////////////
// ////////////////////////////////
// ////////////////////////////////
// ////////////////////////////////

import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";

import "./GeoForm.css";
import Axios from "../../../../../api/axios";

const GeoForm = () => {
  const [code, setCode] = useState("");
  const [englishName, setEnglishName] = useState("");
  const [arabicName, setArabicName] = useState("");
  const [governorates, setGovernorates] = useState([]);
  const [governorateCount, setGovernorateCount] = useState(0);
  const [districtCounts, setDistrictCounts] = useState([]);
  const [cityCounts, setCityCounts] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const countryGuid = uuidv4();
    const countryData = {
      guid: countryGuid,
      code,
      name: englishName,
      nameAr: arabicName,
      enabled: true,
      createdDate: new Date().toISOString(),
    };

    try {
      // Post country data to its endpoint
      await Axios.post("/api/country/v1.0", countryData);
      console.log("Country data posted successfully:", countryData);

      // Post governorates, districts, and cities data
      await Promise.all(
        governorates.map(async (governorate) => {
          const governorateGuid = uuidv4();
          await Axios.post("/api/governorates/v1.0", {
            guid: governorateGuid,
            code: governorate.code,
            name: governorate.name,
            nameAr: governorate.nameAr,
            enabled: true,
            createdDate: new Date().toISOString(),
            staticCountryGuid: countryGuid,
          });
          console.log("Governorate data posted successfully");

          return Promise.all(
            governorate.districts.map(async (district) => {
              const districtGuid = uuidv4();
              await Axios.post("/api/district/v1.0", {
                guid: districtGuid,
                code: district.code,
                name: district.name,
                nameAr: district.nameAr,
                enabled: true,
                createdDate: new Date().toISOString(),
                governorateGuid,
              });
              console.log("District data posted successfully");

              return Promise.all(
                district.cities.map(async (city) => {
                  await Axios.post("/api/city/v1.0", {
                    guid: uuidv4(),
                    code: city.code,
                    name: city.name,
                    nameAr: city.nameAr,
                    enabled: true,
                    createdDate: new Date().toISOString(),
                    districtGuid,
                  });
                  console.log("City data posted successfully");
                })
              );
            })
          );
        })
      );
    } catch (error) {
      console.error("Error posting data:", error);
      setError("Error submitting data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addGovernorate = () => {
    setGovernorates([
      ...governorates,
      {
        code: "",
        name: "",
        nameAr: "",
        districts: [],
      },
    ]);
    setGovernorateCount(governorateCount + 1);
    setDistrictCounts([...districtCounts, 0]);
    setCityCounts([...cityCounts, []]);
  };

  const addDistrict = (index) => {
    const updatedGovernorates = [...governorates];
    updatedGovernorates[index].districts.push({
      code: "",
      name: "",
      nameAr: "",
      cities: [],
    });
    setGovernorates(updatedGovernorates);
    const newDistrictCounts = [...districtCounts];
    newDistrictCounts[index]++;
    setDistrictCounts(newDistrictCounts);
    setCityCounts([...cityCounts, []]);
  };

  const addCity = (govIndex, distIndex) => {
    const updatedGovernorates = [...governorates];
    updatedGovernorates[govIndex].districts[distIndex].cities.push({
      code: "",
      name: "",
      nameAr: "",
    });
    setGovernorates(updatedGovernorates);
    const newCityCounts = [...cityCounts];
    newCityCounts[govIndex][distIndex]++;
    setCityCounts(newCityCounts);
  };

  return (
    <form className="geo-form" onSubmit={handleSubmit}>
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
      <div>
        <label>Governorates:</label>
        {governorates.map((governorate, govIndex) => (
          <div key={govIndex}>
            <h2>{`Governorate ${govIndex + 1}`}</h2>
            <label>Governorates:</label>

            <div key={govIndex}>
              <input
                type="text"
                placeholder="Governorate Code"
                value={governorate.code}
                onChange={(e) =>
                  handleGovernorateChange(govIndex, "code", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Name (English)"
                value={governorate.name}
                onChange={(e) =>
                  handleGovernorateChange(govIndex, "name", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Name (Arabic)"
                value={governorate.nameAr}
                onChange={(e) =>
                  handleGovernorateChange(govIndex, "nameAr", e.target.value)
                }
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={addGovernorate}>
          Add Governorate
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default GeoForm;
