// import React, { useState } from "react";
// import Axios from "../../../../../api/axios";
// import { v4 as uuidv4 } from "uuid";
// import { Link } from "react-router-dom";

// function CompanyTypeForm({ onSubmit }) {
//   const [formData, setFormData] = useState({
//     guid: uuidv4(),
//     name: "",
//     nameAr: "",
//     enabled: true,
//     createdDate: new Date().toISOString(),
//   });
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await Axios.post("/api/CompanyType/v1.0", formData);
//       if (response && response.data) {
//         onSubmit(response.data);
//         setFormData({
//           guid: "",
//           name: "",
//           nameAr: "",
//           enabled: true,
//         });
//         setError(null);
//       } else {
//         setError("Empty response received from the server");
//       }
//     } catch (error) {
//       setError(error.response?.data?.message || "An error occurred");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col p-6 mx-auto">
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 p-4 py-14 md:p-8">
//         <div className="flex flex-col gap-6">
//           <h3 className="text-green-pri">Company Type</h3>

//           <label className="flex flex-col">
//             Name:
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//             />
//           </label>

//           <label className="flex flex-col">
//             Name (Arabic):
//             <input
//               type="text"
//               name="nameAr"
//               value={formData.nameAr}
//               onChange={handleChange}
//             />
//           </label>
//         </div>
//       </div>
//       <div className="btns-col col-span-full flex justify-between">
//         <Link to="/companyType/list" className="med-btn-pri">
//           Go to data records
//         </Link>

//         <button className="med-btn-sec w-24" type="submit">
//           Submit
//         </button>
//       </div>
//     </form>
//   );
// }

// export default CompanyTypeForm;

// /////////////////////////////////
// /////////////////////////////////
// /////////////////////////////////
// /////////////////////////////////

// import React, { useState } from "react";
// import Axios from "../../../../../api/axios";
// import { v4 as uuidv4 } from "uuid";
// import { Link } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function CompanyTypeForm({ onSubmit }) {
//   const [formData, setFormData] = useState({
//     guid: uuidv4(),
//     name: "",
//     nameAr: "",
//     enabled: true,
//     createdDate: new Date().toISOString(),
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await Axios.post("/api/CompanyType/v1.0", formData);
//       if (response.status >= 200 && response.status < 300) {
//         onSubmit(formData);
//         setFormData({
//           guid: uuidv4(),
//           name: "",
//           nameAr: "",
//           enabled: true,
//           createdDate: new Date().toISOString(),
//         });
//         toast.success("Form submitted successfully");
//       } else {
//         toast.error("Failed to submit form");
//       }
//     } catch (error) {
//       toast.error("Failed to submit form");
//     }
//   };

//   return (
//     <div>
//       <ToastContainer />
//       <form onSubmit={handleSubmit} className="flex flex-col p-6 mx-auto">
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 p-4 py-14 md:p-8">
//           <div className="flex flex-col gap-6">
//             <h3 className="text-green-pri">Company Type</h3>

//             <label className="flex flex-col">
//               Name:
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//             </label>

//             <label className="flex flex-col">
//               Name (Arabic):
//               <input
//                 type="text"
//                 name="nameAr"
//                 value={formData.nameAr}
//                 onChange={handleChange}
//                 required
//               />
//             </label>
//           </div>
//         </div>
//         <div className="btns-col col-span-full flex justify-between">
//           <Link to="/companyType/list" className="med-btn-pri">
//             Go to data records
//           </Link>

//           <button className="med-btn-sec w-24" type="submit">
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default CompanyTypeForm;

// ///////////////////////////////
// ///////////////////////////////
// ///////////////////////////////

// import React, { useState } from "react";
// import Axios from "../../../../../api/axios";
// import { v4 as uuidv4 } from "uuid";
// import { Link } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function CompanyTypeForm({ onSubmit }) {
//   const [formData, setFormData] = useState({
//     guid: uuidv4(),
//     name: "",
//     nameAr: "",
//     enabled: true,
//     createdDate: new Date().toISOString(),
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await Axios.post("/api/CompanyType/v1.0", formData);
//       onSubmit(formData);

//       toast.success("Company Type data submitted successfully.");
//     } catch (error) {
//       // Check if the error is a validation error
//       if (error.name === "ValidationError") {
//         // Display validation errors using toast
//         error.errors.forEach((validationError) => {
//           toast.error(validationError);
//         });
//       } else {
//         console.error("Error submitting company type data:", error.message);
//       }
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       guid: uuidv4(),
//       name: "",
//       nameAr: "",
//       enabled: true,
//       createdDate: new Date().toISOString(),
//     });
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit} className="flex flex-col p-6 mx-auto">
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 p-4 py-14 md:p-8">
//           <div className="flex flex-col gap-6">
//             <h3 className="text-green-pri">Company Type</h3>

//             <label className="flex flex-col">
//               Name:
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//             </label>

//             <label className="flex flex-col">
//               Name (Arabic):
//               <input
//                 type="text"
//                 name="nameAr"
//                 value={formData.nameAr}
//                 onChange={handleChange}
//                 required
//               />
//             </label>
//           </div>
//         </div>
//         <div className="btns-col col-span-full flex justify-between">
//           <Link to="/companyType/list" className="med-btn-pri">
//             Go to data records
//           </Link>

//           <button
//             className="med-btn-sec w-24"
//             type="button"
//             onClick={(e) => {
//               handleSubmit(e);
//               handleReset();
//             }}
//           >
//             Submit
//           </button>
//         </div>
//         <ToastContainer position="top-right" autoClose={3000} />
//       </form>
//     </div>
//   );
// }

// export default CompanyTypeForm;
// ///////////////////////////////
// ///////////////////////////////
// ///////////////////////////////

import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import Axios from "../../../../../api/axios";

function CompanyTypeForm() {
  const [formData, setFormData] = useState({
    guid: uuidv4(),
    name: "",
    nameAr: "",
    enabled: true,
    createdDate: new Date().toISOString(),
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await Axios.post("/api/CompanyType/v1.0", formData);
  //     onSubmit(formData);

  //     toast.success("Company type data submitted successfully.");
  //   } catch (error) {
  //     if (error.name === "ValidationError") {
  //       // Concatenate all validation errors into a single message
  //       const errorMessage = error.errors.join(", ");
  //       toast.error(errorMessage);
  //     } else {
  //       console.error("Error submitting company type data:", error.message);
  //     }
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Axios.post("/api/CompanyType/v1.0", formData);
      // Assuming onSubmit is passed correctly, you can call it here
      onSubmit(formData);

      // Display success toast message
      toast.success("Company type data submitted successfully.");
    } catch (error) {
      if (error.name === "ValidationError") {
        // Concatenate all validation errors into a single message
        const errorMessage = error.errors.join(", ");
        toast.error(errorMessage);
      } else {
        console.error("Error submitting company type data:", error.message);
      }
    }
  };

  const handleReset = () => {
    // Clear the form fields
    setFormData({
      guid: uuidv4(),
      name: "",
      nameAr: "",
      enabled: true,
      createdDate: new Date().toISOString(),
    });
  };

  return (
    <div className="company-type-form-container">
      <form onSubmit={handleSubmit} className="flex flex-col p-6 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 p-4 py-14 md:p-8">
          <div className="flex flex-col gap-6">
            <h3 className="text-green-pri">Company Type</h3>

            <label className="flex flex-col">
              <span>Name:</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            <label className="flex flex-col">
              <span>Name (Arabic):</span>
              <input
                type="text"
                name="nameAr"
                value={formData.nameAr}
                onChange={handleChange}
                required
              />
            </label>
          </div>
        </div>
        <div className="btns-col col-span-full flex justify-between">
          <Link to="/companyType/list" className="med-btn-pri">
            Go to data records
          </Link>

          <button
            className="med-btn-sec w-24"
            type="button"
            onClick={handleReset}
          >
            Reset
          </button>

          <button className="med-btn-sec w-24" type="submit">
            Submit
          </button>
        </div>
        {/* <ToastContainer position="top-right" autoClose={3000} /> */}
      </form>
    </div>
  );
}

export default CompanyTypeForm;
