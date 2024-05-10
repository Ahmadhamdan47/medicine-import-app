// /* eslint-disable no-empty */
// /* eslint-disable jsx-a11y/label-has-associated-control */
// import { v4 as uuidv4 } from 'uuid';
// import React, { useState } from 'react';

// import { useAddDrugMutation, useAddPharmacyDrugMutation } from '../../../../../app/slices/apiSlice';

// const generateGUID = () => uuidv4();

// const exchangeRates = {
//   USD: 1,
//   CAD: 0.72,
//   EUR: 1.08,
//   CHF: 1.11,
//   DKK: 0.72,
//   GBP: 1.21,
//   SAR: 0.27,
//   JOD: 1.41,
//   LBP: 90000,
// };

// const currencySymbols = {
//   USD: '$',
//   CAD: 'C$',
//   EUR: '€',
//   CHF: 'CHF',
//   DKK: 'kr',
//   GBP: '£',
//   SAR: 'SAR',
//   JOD: 'JD',
//   LBP: 'LBP',
// };

// const AddDrugForm = () => {
//   const [formData, setFormData] = useState({
//     DrugName: 'Advil',
//     ManufacturerID: 1,
//     RegistrationNumber: '111',
//     GTIN: '11111111111111',
//     Notes: 'string',
//     Description: 'string',
//     IngredientAndStrength: 'string',
//     Indication: 'string',
//     Posology: 'string',
//     MethodOfAdministration: 'string',
//     Contraindications: 'string',
//     PrecautionForUse: 'string',
//     EffectOnFGN: 'string',
//     SideEffect: 'string',
//     Toxicity: 'string',
//     StorageCondition: 'string',
//     ShelfLife: 'string',
//     IngredientLabel: 'string',
//     Price: 0,
//     ImagesPath: 'string',
//     ImageDefault: true,
//     InteractionIngredientName: 'string',
//     IsDouanes: true,
//     RegistrationDate: '2024-03-20',
//     PublicPrice: 0,
//     SubsidyLabel: 'string',
//     SubsidyPercentage: 0,
//     HospPricing: true,
//     Substitutable: true,
//     CreatedBy: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
//     CreatedDate: '2024-03-20T12:09:32.237Z',
//     UpdatedBy: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
//     UpdatedDate: '2024-03-20T12:09:32.237Z',
//     OtherIngredients: 'string',
//     ATCRelatedIngredient: 'string',
//     ReviewDate: '2024-03-20',
//     MoPHCode: 'string',
//     CargoShippingTerms: 'string',
//     ProductType: 'string',
//     NotMarketed: true,
//     DFSequence: 'string',
//     PriceForeign: 0,
//     CurrencyForeign: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
//   });

//   const [addDrug] = useAddDrugMutation(); // Use the generated hook for adding drug
//   const [addPharmacyDrug] = useAddPharmacyDrugMutation(); // Use the generated hook for adding pharmacy drug

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     try {
//       e.preventDefault();
//       await addDrug(formData);
//       // Optionally, you can include additional logic after successful submission
//     } catch (error) {
//       // Handle errors
//       console.error('An error occurred while submitting the form:', error);
//       // Optionally, you can display an error message to the user
//       // For example: setError('An error occurred while submitting the form. Please try again.');
//     }
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     const pharmacyDrugResult = await addPharmacyDrug(formData); // Call addPharmacyDrug mutation first
//   //     const pharmacyDrugData = pharmacyDrugResult.data; // Get the data from the result of addPharmacyDrug

//   //     // If addPharmacyDrug was successful and returned data
//   //     if (pharmacyDrugResult.isSuccess && pharmacyDrugData) {
//   //       // Call addDrug mutation only if addPharmacyDrug succeeded
//   //       await addDrug(formData);
//   //     } else {
//   //       // Handle the case where addPharmacyDrug failed or did not return data
//   //       console.error('Failed to add pharmacy drug or no data returned:', pharmacyDrugResult.error);
//   //     }
//   //   } catch (error) {}
//   // };

//   return (
//     <form
//       className="w-full h-auto mt-12 mb-20 flex flex-col mx-auto text-black-text dark:text-white-text"
//       onSubmit={handleSubmit}
//     >
//       <div className="mx-4 p-3 rounded-2xl border border-green-pri">
//         <h2>Add Drug</h2>
//         <div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 md:gap-10 pt-6">
//             <div className="input-container relative">
//               <label htmlFor="DrugName" className="labels mb-2 text-md flex flex-col text-left">
//                 Drug Name
//               </label>
//               <input
//                 name="DrugName"
//                 value={formData.DrugName}
//                 onChange={handleInputChange}
//                 type="text"
//                 autoComplete="off"
//                 placeholder="name"
//                 className="w-full px-3 py-2 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//               />
//             </div>

//             <div className="flex justify-between 2xl:justify-center 2xl:gap-16 gap-4 px-10 md:px-0 mb-4">
//               <label htmlFor="Price" className="labels text-md flex flex-col text-left">
//                 Price
//                 <input
//                   name="Price"
//                   type="number"
//                   value={formData.Price}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 />
//               </label>

//               <label htmlFor="Price" className="labels text-md flex flex-col text-left">
//                 Foreign Price
//                 <input
//                   name="PriceForeign"
//                   type="number"
//                   value={formData.PriceForeign}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 />
//               </label>
//             </div>
//             {/* <select
//                 name="CurrencyForeign"
//                 value={formData.CurrencyForeign}
//                 onChange={handleInputChange}
//               >
//                 <option value="" disabled>
//                   Select currency
//                 </option>
//                 {Object.entries(currencySymbols).map(([currency, symbol]) => (
//                   <option key={currency} value={currency}>
//                     {`${symbol} ${currency}`}
//                   </option>
//                 ))}
//               </select> */}

//             {/* Converted price inputs */}

//             {/* <div className="input-container flex">
//               <label className="labels text-md block text-left">
//                 Foreign Price in USD
//                 <input
//                   name="PriceUSD"
//                   value={formData.PriceUSD}
//                   readOnly
//                 />
//               </label>

//               <label className="labels text-md block text-left">
//                 Foreign Price in LBP
//                 <input name="PriceLBP" value={formData.PriceLBP} readOnly />
//               </label>
//             </div> */}
//             {/* </div> */}

//             {/* <div className="col-1"> */}
//             {/* <label className="labels mb-2 text-md flex flex-col text-left" htmlFor="Code">
//               Code
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="text"
//                 id="Code"
//                 name="Code"
//                 value={formData.Code}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label> */}

//             <label
//               className="labels mb-2 text-md flex flex-col text-left"
//               htmlFor="RegistrationNumber"
//             >
//               Registration Number
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="text"
//                 id="RegistrationNumber"
//                 name="RegistrationNumber"
//                 value={formData.RegistrationNumber}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             <label
//               className="labels mb-2 text-md flex flex-col text-left"
//               htmlFor="RegistrationDate"
//             >
//               Registration date
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="text"
//                 id="RegistrationDate"
//                 name="RegistrationDate"
//                 value={formData.RegistrationDate}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             <label className="font-medium block" htmlFor="SubsidyPercentage">
//               Subsidy Percentage
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="text"
//                 id="SubsidyPercentage"
//                 name="SubsidyPercentage"
//                 value={formData.SubsidyPercentage}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             <label className="font-medium block" htmlFor="REP_date">
//               repDate
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="date"
//                 id="REP_date"
//                 name="REP_date"
//                 value={formData.REP_date}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             <label className="font-medium block" htmlFor="B_G">
//               B/G
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="text"
//                 id="B_G"
//                 name="B_G"
//                 value={formData.B_G}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             {/* <div className="col-2"> */}
//             <label className="font-medium block" htmlFor="Date_dc">
//               Date dc
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="date"
//                 id="Date_dc"
//                 name="Date_dc"
//                 value={formData.Date_dc}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             <label className="font-medium block" htmlFor="LASTEffective_Date">
//               Last effective Date
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="date"
//                 id="LASTEffective_Date"
//                 name="LASTEffective_Date"
//                 value={formData.LASTEffective_Date}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             <label className="font-medium block" htmlFor="UpdatedDate">
//               Updated Date
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="date"
//                 id="UpdatedDate"
//                 name="UpdatedDate"
//                 value={formData.UpdatedDate}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             <label className="font-medium block" htmlFor="CIF_FOB">
//               CIF/FOB
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="text"
//                 id="CIF_FOB"
//                 name="CIF_FOB"
//                 value={formData.CIF_FOB}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             <label className="font-medium block" htmlFor="LASTPublicABP">
//               Last public Abp
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="text"
//                 id="LASTPublicABP"
//                 name="LASTPublicABP"
//                 value={formData.LASTPublicABP}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             {/* <div className="col-3"> */}
//             <label className="font-medium block" htmlFor="LJ_FOB_ValueUSD">
//               lj Fob Value Usd
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="number"
//                 id="LJ_FOB_ValueUSD"
//                 name="LJ_FOB_ValueUSD"
//                 value={formData.LJ_FOB_ValueUSD}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             <label className="font-medium block mt-3" htmlFor="WJ_Leb_PubPriceHos">
//               wjLeb Pub Price Hos
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="text"
//                 id="WJ_Leb_PubPriceHos"
//                 name="WJ_Leb_PubPriceHos"
//                 value={formData.WJ_Leb_PubPriceHos}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             <label className="font-medium block" htmlFor="Seq">
//               Seq
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="text"
//                 id="Seq"
//                 name="Seq"
//                 value={formData.Seq}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             <label className="font-medium block" htmlFor="EffectOnFGN">
//               Effect on FGN
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="text"
//                 id="EffectOnFGN"
//                 name="EffectOnFGN"
//                 value={formData.EffectOnFGN}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             <label className="font-medium block" htmlFor="SideEffect">
//               Side Effect
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="text"
//                 id="SideEffect"
//                 name="SideEffect"
//                 value={formData.SideEffect}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             <label className="font-medium block" htmlFor="WEBCIF_FOB">
//               Web cif/Fob
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="text"
//                 id="WEBCIF_FOB"
//                 name="WEBCIF_FOB"
//                 value={formData.WEBCIF_FOB}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             <label className="font-medium block" htmlFor="WEBPublicABP">
//               Web public Abp
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="number"
//                 id="WEBPublicABP"
//                 name="WEBPublicABP"
//                 value={formData.WEBPublicABP}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             <label className="font-medium block" htmlFor="WEBCurrency">
//               Web currency
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 id="WEBCurrency"
//                 name="WEBCurrency"
//                 value={formData.WEBCurrency}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             <label className="font-medium block" htmlFor="Posology">
//               Posology
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="text"
//                 id="Posology"
//                 name="Posology"
//                 value={formData.Posology}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             {/* <div className="col-2 flex flex-col"> */}
//             <label className="font-medium block" htmlFor="GTIN">
//               GTIN
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="text"
//                 id="GTIN"
//                 name="GTIN"
//                 value={formData.GTIN}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             <label className="font-medium block" htmlFor="Notes">
//               Notes
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="text"
//                 id="Notes"
//                 name="Notes"
//                 value={formData.Notes}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             <label className="font-medium block" htmlFor="IngredientLabel">
//               Ingredient Label
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="text"
//                 id="IngredientLabel"
//                 name="IngredientLabel"
//                 value={formData.IngredientLabel}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             {/* <div className="col-5"> */}
//             <label className="font-medium block" htmlFor="Description">
//               Description
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="text"
//                 id="Description"
//                 name="Description"
//                 value={formData.Description}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             <label className="font-medium block" htmlFor="ActiveInactiveIngredient">
//               Active Inactive Ingredient
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="text"
//                 id="ActiveInactiveIngredient"
//                 name="ActiveInactiveIngredient"
//                 value={formData.ActiveInactiveIngredient}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             <label className="font-medium block" htmlFor="Indication">
//               Indication
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="text"
//                 id="Indication"
//                 name="Indication"
//                 value={formData.Indication}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             <label className="font-medium block" htmlFor="MethodOfAdministration">
//               Method Of Administration
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="text"
//                 id="MethodOfAdministration"
//                 name="MethodOfAdministration"
//                 value={formData.MethodOfAdministration}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             <label className="font-medium block" htmlFor="Contraindications">
//               Contraindications
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="text"
//                 id="Contraindications"
//                 name="Contraindications"
//                 value={formData.Contraindications}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             <label className="font-medium block" htmlFor="PrecautionForUse">
//               Precaution For Use
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="text"
//                 id="PrecautionForUse"
//                 name="PrecautionForUse"
//                 value={formData.PrecautionForUse}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             <label className="font-medium block" htmlFor="Toxicity">
//               Toxicity
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="text"
//                 id="Toxicity"
//                 name="Toxicity"
//                 value={formData.Toxicity}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             <label className="font-medium block" htmlFor="StorageCondition">
//               Storage Condition
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="text"
//                 id="StorageCondition"
//                 name="StorageCondition"
//                 value={formData.StorageCondition}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>

//             <label className="font-medium block" htmlFor="ShelfLife">
//               Shelf Life
//               <input
//                 className="w-full mb-4 px-3 py-2 mt-1 border-none focus:ring rounded bg-white-bg dark:bg-black-input"
//                 type="text"
//                 id="ShelfLife"
//                 name="ShelfLife"
//                 value={formData.ShelfLife}
//                 onChange={handleInputChange}
//                 // required
//               />
//             </label>
//           </div>
//         </div>
//         <div className="checkboxes w-full flex flex-wrap justify-center items-center border border-gray-500 mb-4 gap-6 p-4">
//           <div>
//             <label className="font-medium block" htmlFor="HospPricing">
//               Hosp Pricing
//             </label>
//             <input
//               className=" cursor-pointer border rounded"
//               type="checkbox"
//               id="HospPricing"
//               name="HospPricing"
//               value={formData.HospPricing}
//               onChange={handleInputChange}
//               // required
//             />
//           </div>
//           <div>
//             <label className="font-medium block" htmlFor="IsDouanes">
//               is Douanes:
//             </label>
//             <input
//               className=" border cursor-pointer rounded"
//               type="checkbox"
//               id="IsDouanes"
//               name="IsDouanes"
//               value={formData.IsDouanes}
//               onChange={handleInputChange}
//               // required
//             />
//           </div>
//           <div>
//             <label className="font-medium block" htmlFor="NM">
//               None Marketed
//             </label>
//             <input
//               className="cursor-pointer border rounded"
//               type="checkbox"
//               id="NM"
//               name="NM"
//               value={formData.NM}
//               onChange={handleInputChange}
//               // required
//             />
//           </div>
//           <div>
//             <label className="font-medium block" htmlFor="isOtc">
//               is Otc
//             </label>
//             <input
//               className="border cursor-pointer rounded"
//               type="checkbox"
//               id="isOtc"
//               name="isOtc"
//               value={formData.IsOTC}
//               onChange={handleInputChange}
//               // required
//             />
//           </div>
//           <div>
//             <label className="font-medium block" htmlFor="isNssf">
//               is Nssf
//             </label>
//             <input
//               className="border cursor-pointer rounded"
//               type="checkbox"
//               id="isNssf"
//               name="isNssf"
//               value={formData.IsNSSF}
//               onChange={handleInputChange}
//               // required
//             />
//           </div>

//           <div>
//             <label className="font-medium block" htmlFor="isNarcotis">
//               is Narcotis
//             </label>
//             <input
//               className="border cursor-pointer rounded"
//               type="checkbox"
//               id="isNarcotis"
//               name="isNarcotis"
//               value={formData.IsNarcotis}
//               onChange={handleInputChange}
//               // required
//             />
//           </div>

//           <div>
//             <label className="font-medium block" htmlFor="isBiological">
//               is Biological
//             </label>
//             <input
//               className="border cursor-pointer rounded"
//               type="checkbox"
//               id="isBiological"
//               name="isBiological"
//               value={formData.IsBiological}
//               onChange={handleInputChange}
//               // required
//             />
//           </div>
//         </div>

//         <div className="w-full flex justify-center items-center">
//           <button type="submit" className="med-btn-pri-sm">
//             Submit
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default AddDrugForm;
