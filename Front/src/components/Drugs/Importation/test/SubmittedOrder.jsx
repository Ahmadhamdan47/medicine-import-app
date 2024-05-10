import React from "react";

import { useImportation } from "../ImportationContext";

const SubmittedOrder = ({ order }) => {
  // Accessing submitOrder function from ImportationContext
  const { submitOrder } = useImportation();

  const handleReSubmit = () => {
    // Call submitOrder function to resubmit the order
    submitOrder(order);
  };

  // Check if order is defined before rendering
  if (!order) {
    return null; // or render a loading indicator or error message
  }

  return (
    <div>
      <h2>Submitted Order</h2>
      <p>Order ID: {order.orderId}</p>
      <p>Brand Name: {order.brandName}</p>
      <p>Quantity Requested: {order.quantityRequested}</p>
      {/* Additional order details */}
      <button onClick={handleReSubmit}>Re-Submit Order</button>
    </div>
  );
};

export default SubmittedOrder;
