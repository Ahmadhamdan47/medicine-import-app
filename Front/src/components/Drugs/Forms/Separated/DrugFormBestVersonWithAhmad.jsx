// // import "./DrugForm.css";
// // import { useDrugFormContext } from "./drugs/DrugFormProvider";

// // const DrugForm = () => {
// //   const { formData, handleChange, handleSubmit, error } = useDrugFormContext();

// //   return (
// //     <form
// //       className="drug-form grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-14 gap-8 mx-auto w-[80%] "
// //       onSubmit={handleSubmit}
// //     >
// //       {/* Display error message if any */}
// //       {error && <div className="error-message">{error}</div>}

// //       {/* Input fields for the Drug model */}
// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="BrandName">
// //           Brand Name:
// //         </label>
// //         <input
// //           type="text"
// //           id="BrandName"
// //           name="BrandName"
// //           value={formData.BrandName}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="ATCName">
// //           ATC Name:
// //         </label>
// //         <input
// //           type="text"
// //           id="ATCName"
// //           name="ATCName"
// //           value={formData.ATCName}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="DosageName">
// //           Dosage Name:
// //         </label>
// //         <input
// //           type="text"
// //           id="DosageName"
// //           name="DosageName"
// //           value={formData.DosageName}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="PresentationName">
// //           Presentation:
// //         </label>
// //         <input
// //           type="text"
// //           id="PresentationName"
// //           name="PresentationName"
// //           value={formData.PresentationName}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="FormName">
// //           Form Name:
// //         </label>
// //         <input
// //           type="text"
// //           id="FormName"
// //           name="FormName"
// //           value={formData.FormName}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="RouteName">
// //           Route Name:
// //         </label>
// //         <input
// //           type="text"
// //           id="RouteName"
// //           name="RouteName"
// //           value={formData.RouteName}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="StratumName">
// //           Stratum Name:
// //         </label>
// //         <input
// //           type="text"
// //           id="StratumName"
// //           name="StratumName"
// //           value={formData.StratumName}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="PriceUSD">
// //           Price USD:
// //         </label>
// //         <input
// //           type="number"
// //           id="PriceUSD"
// //           name="PriceUSD"
// //           value={formData.PriceUSD}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="PriceLBP">
// //           Price LBP:
// //         </label>
// //         <input
// //           type="number"
// //           id="PriceLBP"
// //           name="PriceLBP"
// //           value={formData.PriceLBP}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       {/* <div className="input-group">
// //         <label className="drug-label" htmlFor="ImageDefault">Default Image:</label>
// //         <input
// //           type="file"
// //           id="ImageDefault"
// //           name="ImageDefault"
// //           value={formData.ImageDefault}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div> */}

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="ImagesPath">
// //           Drug Image:
// //         </label>
// //         <input
// //           type="file"
// //           id="ImagesPath"
// //           name="ImagesPath"
// //           value={formData.ImagesPath}
// //           onChange={handleChange}
// //           className="drug-input"
// //           // required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="InteractionIngredientName">
// //           Interaction Ingredient Name:
// //         </label>
// //         <input
// //           type="text"
// //           id="InteractionIngredientName"
// //           name="InteractionIngredientName"
// //           value={formData.InteractionIngredientName}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="AgentName">
// //           Agent Name:
// //         </label>
// //         <input
// //           type="text"
// //           id="AgentName"
// //           name="AgentName"
// //           value={formData.AgentName}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="ManufacturerName">
// //           Manufacturer Name:
// //         </label>
// //         <input
// //           type="text"
// //           id="ManufacturerName"
// //           name="ManufacturerName"
// //           value={formData.ManufacturerName}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="CountryName">
// //           Country Name:
// //         </label>
// //         <input
// //           type="text"
// //           id="CountryName"
// //           name="CountryName"
// //           value={formData.CountryName}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="ResponsiblePartyName">
// //           ResponsibleParty Name:
// //         </label>
// //         <input
// //           type="text"
// //           id="ResponsiblePartyName"
// //           name="ResponsiblePartyName"
// //           value={formData.ResponsiblePartyName}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="DrugLabelName">
// //           DrugLabel Name:
// //         </label>
// //         <input
// //           type="text"
// //           id="DrugLabelName"
// //           name="DrugLabelName"
// //           value={formData.DrugLabelName}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="Code">
// //           Code:
// //         </label>
// //         <input
// //           type="text"
// //           id="Code"
// //           name="Code"
// //           value={formData.Code}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="RegistrationNumber">
// //           Registration Number:
// //         </label>
// //         <input
// //           type="text"
// //           id="RegistrationNumber"
// //           name="RegistrationNumber"
// //           value={formData.RegistrationNumber}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="CIF_FOB">
// //           CIF_FOB:
// //         </label>
// //         <input
// //           type="text"
// //           id="CIF_FOB"
// //           name="CIF_FOB"
// //           value={formData.CIF_FOB}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="B_G">
// //           Brand_Generic:
// //         </label>
// //         <input
// //           type="text"
// //           id="B_G"
// //           name="B_G"
// //           value={formData.B_G}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="NM">
// //           None Marketed:
// //         </label>
// //         <input
// //           type="checkbox"
// //           id="NM"
// //           name="NM"
// //           value={formData.NM}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="GTIN">
// //           GTIN Number:
// //         </label>
// //         <input
// //           type="number"
// //           id="GTIN"
// //           name="GTIN"
// //           value={formData.GTIN}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="Notes">
// //           Notes:
// //         </label>
// //         <input
// //           type="text"
// //           id="Notes"
// //           name="Notes"
// //           value={formData.Notes}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="Description">
// //           Description:
// //         </label>
// //         <input
// //           type="text"
// //           id="Description"
// //           name="Description"
// //           value={formData.Description}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="ActiveInactiveIngredient">
// //           Active/Inactive Ingredient:
// //         </label>
// //         <input
// //           type="text"
// //           id="ActiveInactiveIngredient"
// //           name="ActiveInactiveIngredient"
// //           value={formData.ActiveInactiveIngredient}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="Indication">
// //           Indication:
// //         </label>
// //         <input
// //           type="text"
// //           id="Indication"
// //           name="Indication"
// //           value={formData.Indication}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="Posology">
// //           Posology:
// //         </label>
// //         <input
// //           type="text"
// //           id="Posology"
// //           name="Posology"
// //           value={formData.Posology}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="MethodOfAdministration">
// //           Method Of Administration:
// //         </label>
// //         <input
// //           type="text"
// //           id="MethodOfAdministration"
// //           name="MethodOfAdministration"
// //           value={formData.MethodOfAdministration}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="Contraindications">
// //           Contraindications:
// //         </label>
// //         <input
// //           type="text"
// //           id="Contraindications"
// //           name="Contraindications"
// //           value={formData.Contraindications}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="PrecautionForUse">
// //           Precaution For Use:
// //         </label>
// //         <input
// //           type="text"
// //           id="PrecautionForUse"
// //           name="PrecautionForUse"
// //           value={formData.PrecautionForUse}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="EffectOnFGN">
// //           Effect On FGN:
// //         </label>
// //         <input
// //           type="text"
// //           id="EffectOnFGN"
// //           name="EffectOnFGN"
// //           value={formData.EffectOnFGN}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="SideEffect">
// //           Side Effect:
// //         </label>
// //         <input
// //           type="text"
// //           id="SideEffect"
// //           name="SideEffect"
// //           value={formData.SideEffect}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="Toxicity">
// //           Toxicity:
// //         </label>
// //         <input
// //           type="text"
// //           id="Toxicity"
// //           name="Toxicity"
// //           value={formData.Toxicity}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="StorageCondition">
// //           Storage Condition:
// //         </label>
// //         <input
// //           type="text"
// //           id="StorageCondition"
// //           name="StorageCondition"
// //           value={formData.StorageCondition}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="ShelfLife">
// //           Shelf Life:
// //         </label>
// //         <input
// //           type="text"
// //           id="ShelfLife"
// //           name="ShelfLife"
// //           value={formData.ShelfLife}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="IngredientLabel">
// //           Ingredient Label:
// //         </label>
// //         <input
// //           type="text"
// //           id="IngredientLabel"
// //           name="IngredientLabel"
// //           value={formData.IngredientLabel}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="IsBiological">
// //           Is Biological:
// //         </label>
// //         <input
// //           type="checkbox"
// //           id="IsBiological"
// //           name="IsBiological"
// //           value={formData.IsBiological}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="IsNarcotis">
// //           Is Narcotis:
// //         </label>
// //         <input
// //           type="checkbox"
// //           id="IsNarcotis"
// //           name="IsNarcotis"
// //           value={formData.IsNarcotis}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="IsOTC">
// //           Is OTC:
// //         </label>
// //         <input
// //           type="checkbox"
// //           id="IsOTC"
// //           name="IsOTC"
// //           value={formData.IsOTC}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       <div className="input-group">
// //         <label className="drug-label" htmlFor="IsNSSF">
// //           Is NSSF:
// //         </label>
// //         <input
// //           type="checkbox"
// //           id="IsNSSF"
// //           name="IsNSSF"
// //           value={formData.IsNSSF}
// //           onChange={handleChange}
// //           className="drug-input"
// //           required
// //         />
// //       </div>

// //       {/* Continue adding input fields for the remaining fields in the Drug model */}

// //       <button className="drug-button" type="submit">
// //         Submit
// //       </button>
// //     </form>
// //   );
// // };

// // export default DrugForm;

// // ///////////////////////////////
// // ///////////////////////////////
// // ///////////////////////////////
// // ///////////////////////////////
// // ///////////////////////////////

// import React from "react";
// import "./DrugForm.css";
// import { useDrugFormContext } from "./drugs/DrugFormProvider";

// const DrugForm = () => {
//   const {
//     formData,
//     handleChange,
//     handleSubmit,
//     handleNext,
//     handlePrevious,
//     error,
//     currentStep,
//     steps,
//   } = useDrugFormContext();

//   const renderStep = (stepIndex) => {
//     switch (stepIndex) {
//       case 0:
//         return (
//           <div className="step-0">
//             <div className="input-group">
//               <label className="drug-label" htmlFor="Code">
//                 Code:
//               </label>
//               <input
//                 type="text"
//                 id="Code"
//                 name="Code"
//                 value={formData.Code}
//                 onChange={handleChange}
//                 className="drug-input"
//                 required
//               />
//             </div>
            
//             <div className="input-group">
//               <label className="drug-label" htmlFor="BrandName">
//                 Brand Name:
//               </label>
//               <input
//                 type="text"
//                 id="BrandName"
//                 name="BrandName"
//                 value={formData.BrandName}
//                 onChange={handleChange}
//                 className="drug-input"
//                 required
//               />
//             </div>

//             <div className="input-group">
//               <label className="drug-label" htmlFor="DosageName">
//                 Dosage Name:
//               </label>
//               <input
//                 type="text"
//                 id="DosageName"
//                 name="DosageName"
//                 value={formData.DosageName}
//                 onChange={handleChange}
//                 className="drug-input"
//                 required
//               />
//             </div>
//           </div>
//         );
//       case 1:
//         return (
//           <div className="step-1">
//             <div className="input-group">
//               <label className="drug-label" htmlFor="FormName">
//                 Form Name:
//               </label>
//               <input
//                 type="text"
//                 id="FormName"
//                 name="FormName"
//                 value={formData.FormName}
//                 onChange={handleChange}
//                 className="drug-input"
//                 required
//               />
//             </div>

//             <div className="input-group">
//               <label className="drug-label" htmlFor="RouteName">
//                 Route Name:
//               </label>
//               <input
//                 type="text"
//                 id="RouteName"
//                 name="RouteName"
//                 value={formData.RouteName}
//                 onChange={handleChange}
//                 className="drug-input"
//                 required
//               />
//             </div>
//           </div>
//         );
//       case 2:
//         return (
//           <div className="step-2">
//             <div className="input-group">
//               <label className="drug-label" htmlFor="PriceUSD">
//                 Price USD:
//               </label>
//               <input
//                 type="number"
//                 id="PriceUSD"
//                 name="PriceUSD"
//                 value={formData.PriceUSD}
//                 onChange={handleChange}
//                 className="drug-input"
//                 required
//               />
//             </div>

//             <div className="input-group">
//               <label className="drug-label" htmlFor="PriceLBP">
//                 Price LBP:
//               </label>
//               <input
//                 type="number"
//                 id="PriceLBP"
//                 name="PriceLBP"
//                 value={formData.PriceLBP}
//                 onChange={handleChange}
//                 className="drug-input"
//                 required
//               />
//             </div>
//           </div>
//         );
//       // Add cases for other steps
//       default:
//         return null;
//     }
//   };

//   return (
//     <form
//       className="drug-form grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-14 gap-8 mx-auto w-[80%] "
//       onSubmit={handleSubmit}
//     >
//       {error && <div className="error-message">{error}</div>}

//       {/* Render current step */}
//       {renderStep(currentStep)}

//       <div className="buttons-container">
//         {/* Previous Button */}
//         {currentStep > 0 && (
//           <button
//             type="button"
//             onClick={handlePrevious}
//             className="previous-button"
//           >
//             Previous
//           </button>
//         )}

//         {/* Next Button */}
//         {currentStep < steps.length - 1 && (
//           <button type="button" onClick={handleNext} className="next-button">
//             Next
//           </button>
//         )}

//         {/* Submit Button */}
//         {currentStep === steps.length - 1 && (
//           <button type="submit" className="submit-button">
//             Submit
//           </button>
//         )}
//       </div>
//     </form>
//   );
// };

// export default DrugForm;
