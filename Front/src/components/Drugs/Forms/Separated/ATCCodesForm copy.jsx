// import React, { useState } from "react";
// import Axios from "../../../../api/axios";
// import { v4 as uuidv4 } from "uuid";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const ATCCodesForm = ({ atcGuid }) => {
//   const [formData, setFormData] = useState({
//     guid: uuidv4(),
//     atcGuid: atcGuid, // Use the atcGuid prop passed from the previous step
//     code: "",
//     levelName: "",
//     levelNameAr: "",
//     levelNumber: "",
//     substanceName: "",
//     atcingredientName: "",
//     atcingredientNameAr: "",
//     interactionIngredientName: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await Axios.post("/api/atccodes/v1.0", formData);
//       console.log(response.data);

//       // Show success toast notification
//       toast.success("Form submitted successfully!", {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: false,
//         draggable: false,
//         progress: undefined,
//       });

//       // Reset the form after successful submission
//       setFormData({
//         guid: uuidv4(),
//         atcGuid: atcGuid, // Use the atcGuid prop passed from the previous step
//         code: "",
//         levelName: "",
//         levelNameAr: "",
//         levelNumber: "",
//         substanceName: "",
//         atcingredientName: "",
//         atcingredientNameAr: "",
//         interactionIngredientName: "",
//       });
//     } catch (error) {
//       console.error("Error:", error.response.data.message);

//       if (
//         error.response &&
//         error.response.data &&
//         error.response.data.message ===
//           "The Code records is already existing, please enter a different value."
//       ) {
//         // Show generic error toast notification
//         toast.error("Form submission failed. Please try again later.", {
//           position: "top-right",
//           autoClose: 2000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: false,
//           draggable: false,
//           progress: undefined,
//         });
//       } else {
//         // Show specific error toast notification
//         toast.error(
//           "The Code records is already exist. Please enter a different value.",
//           {
//             position: "top-right",
//             autoClose: 5000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: false,
//             progress: undefined,
//           }
//         );
//       }
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-8 px-4 bg-white-contents dark:bg-black-contents rounded-2xl p-4 text-black-text dark:text-white-text">
//       <h2 className="text-2xl font-semibold mb-4">Create New ATC Code</h2>

//       <div className="mb-4">
//         <label htmlFor="code" className="block mb-1">
//           Code:
//         </label>
//         <input
//           type="text"
//           name="code"
//           value={formData.code}
//           onChange={handleChange}
//           className="w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
//           required
//           maxLength={3}
//           autoComplete="off"
//         />
//       </div>

//       <div className="mb-4">
//         <label htmlFor="levelName" className="block mb-1">
//           Level Name:
//         </label>
//         <input
//           type="text"
//           name="levelName"
//           value={formData.levelName}
//           onChange={handleChange}
//           className="w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
//           required
//           autoComplete="off"
//         />
//       </div>

//       <div className="mb-4">
//         <label htmlFor="levelNameAr" className="block mb-1">
//           Level Name Arabic:
//         </label>
//         <input
//           type="text"
//           name="levelNameAr"
//           value={formData.levelNameAr}
//           onChange={handleChange}
//           className="w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
//           required
//           autoComplete="off"
//         />
//       </div>

//       <div className="mb-4">
//         <label htmlFor="levelNumber" className="block mb-1">
//           Level Number:
//         </label>
//         <input
//           type="number"
//           name="levelNumber"
//           value={formData.levelNumber}
//           onChange={handleChange}
//           className="w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
//           required
//           autoComplete="off"
//         />
//       </div>

//       <div className="mb-4">
//         <label htmlFor="substanceName" className="block mb-1">
//           Substance Name:
//         </label>
//         <input
//           type="text"
//           name="substanceName"
//           value={formData.substanceName}
//           onChange={handleChange}
//           className="w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
//           required
//           autoComplete="off"
//         />
//       </div>

//       <div className="mb-4">
//         <label htmlFor="atcingredientName" className="block mb-1">
//           ATC Ingredient Name:
//         </label>
//         <input
//           type="text"
//           name="atcingredientName"
//           value={formData.atcingredientName}
//           onChange={handleChange}
//           className="w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
//           required
//           autoComplete="off"
//         />
//       </div>

//       <div className="mb-4">
//         <label htmlFor="atcingredientNameAr" className="block mb-1">
//           ATC Ingredient Name Arabic:
//         </label>
//         <input
//           type="text"
//           name="atcingredientNameAr"
//           value={formData.atcingredientNameAr}
//           onChange={handleChange}
//           className="w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
//           required
//           autoComplete="off"
//         />
//       </div>

//       <div className="mb-4">
//         <label htmlFor="interactionIngredientName" className="block mb-1">
//           Interaction Ingredient Name:
//         </label>
//         <input
//           type="text"
//           name="interactionIngredientName"
//           value={formData.interactionIngredientName}
//           onChange={handleChange}
//           className="w-full rounded-full border border-[#00a65100] dark:border-black-border bg-white-bg dark:bg-black-input px-4 py-2 font-normal shadow-md dark:shadow-black-shadow outline-none focus:border-green-pri focus:outline-none focus:ring-2 focus:ring-green-pri dark:focus:ring-2 dark:focus:ring-green-pri"
//           required
//           autoComplete="off"
//         />
//       </div>
//       <button onClick={handleSubmit} className="med-btn-pri" type="submit">
//         Submit
//       </button>
//       <ToastContainer />
//     </div>
//   );
// };

// export default ATCCodesForm;
