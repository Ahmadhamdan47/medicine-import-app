// import React from "react";
// // import Axios from "axios";
// import { useRFI } from "../ImportationContext";

// const RFIForm = () => {
//   const {
//     rfiFormData,
//     isInputsEnabled,
//     handleInputChange,
//     handleCheckboxChange,
//     saveRFI,
//     updateRFI,
//     deleteRFI,
//   } = useRFI();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (rfiFormData.rfiId) {
//       updateRFI();
//     } else {
//       saveRFI();
//     }
//   };

//   return (
//     <div>
//       <h2>RFI Form</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="drugId">Drug ID</label>
//           <input
//             type="text"
//             id="drugId"
//             value={rfiFormData.drugId}
//             onChange={(e) => handleInputChange("drugId", e.target.value)}
//             autoFocus
//             placeholder="Drug ID"
//           />
//         </div>
//         <div>
//           <label htmlFor="quantity">Quantity</label>
//           <input
//             type="text"
//             id="quantity"
//             value={rfiFormData.quantity}
//             onChange={(e) => handleInputChange("quantity", e.target.value)}
//             placeholder="Quantity"
//           />
//         </div>
//         {/* Add more input fields as needed */}
//         <div>
//           <input
//             type="checkbox"
//             id="enableInputs"
//             checked={isInputsEnabled}
//             onChange={handleCheckboxChange}
//           />
//           <label htmlFor="enableInputs">Add Offer</label>
//         </div>
//         {isInputsEnabled && (
//           <div>
//             {/* Offer Type input field */}
//             {/* Offer Input input field */}
//           </div>
//         )}
//         <div>
//           <label htmlFor="notes">Notes</label>
//           <textarea
//             id="notes"
//             value={rfiFormData.notes}
//             onChange={(e) => handleInputChange("notes", e.target.value)}
//             placeholder="Notes"
//           />
//         </div>
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default RFIForm;
import React, { useState } from "react";

import { useImportation } from "../ImportationContext";

const RFIForm = () => {
  // Accessing necessary state and functions from ImportationContext
  const { handleRFIInputChange, submitRFI } = useImportation();

  // State to manage form data
  const [formData, setFormData] = useState({
    orderId: "",
    drugId: "",
    quantity: "",
    offerType: "",
    offerInput: "",
    notes: "",
  });

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    submitRFI(formData); // Submit RFI data
    // Optionally, you can clear the form data after submission
    setFormData({
      orderId: "",
      drugId: "",
      quantity: "",
      offerType: "",
      offerInput: "",
      notes: "",
    });
  };

  return (
    <div>
      <h2>RFI Forms</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="orderId"
          placeholder="Order ID"
          value={formData.orderId}
          onChange={handleChange}
        />
        <input
          type="text"
          name="drugId"
          placeholder="Drug ID"
          value={formData.drugId}
          onChange={handleChange}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
        />
        <input
          type="text"
          name="offerType"
          placeholder="Offer Type"
          value={formData.offerType}
          onChange={handleChange}
        />
        <input
          type="number"
          name="offerInput"
          placeholder="Offer Input"
          value={formData.offerInput}
          onChange={handleChange}
        />
        <input
          type="text"
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default RFIForm;
