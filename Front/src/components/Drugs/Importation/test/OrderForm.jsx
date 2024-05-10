// import React, { useState } from "react";
// import { useImportation, useRFI } from "../ImportationContext";

// const OrderForm = () => {
//   const { rfiFormData, handleInputChange, saveRFI } = useRFI();
//   const { orderData, setOrderData, submitOrder } = useImportation();

//   const handleOrderInputChange = (field, value) => {
//     // Update orderData state with the new value
//     setOrderData((prevOrderData) => ({
//       ...prevOrderData,
//       [field]: value,
//     }));
//   };

//   // const handleSubmit = (e) => {
//   //   e.preventDefault();
//   //   submitOrder();
//   //   saveRFI();
//   // };

//   const brandName = orderData.brandName || "";
//   const quantity = orderData.quantity || "";
//   const amount = orderData.amount || "";

//   return (
//     <div>
//       <h2>Order Form</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Brand Name"
//           value={brandName}
//           onChange={(e) => handleOrderInputChange("brandName", e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Quantity"
//           value={quantity}
//           onChange={(e) => handleOrderInputChange("quantity", e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Amount"
//           value={amount}
//           onChange={(e) => handleOrderInputChange("amount", e.target.value)}
//         />
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default OrderForm;
import React, { useState } from "react";

import { useImportation } from "../ImportationContext";

const OrderForm = () => {
  // Accessing necessary state and functions from ImportationContext
  const { handleOrderInputChange, submitOrder } = useImportation();

  // State to manage form data
  const [formData, setFormData] = useState({
    brandName: "",
    quantity: "",
    amount: "",
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
    submitOrder(formData); // Submit order data
    // Optionally, you can clear the form data after submission
    setFormData({
      brandName: "",
      quantity: "",
      amount: "",
    });
  };

  return (
    <div>
      <h2>Order Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="brandName"
          placeholder="Brand Name"
          value={formData.brandName}
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
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default OrderForm;
