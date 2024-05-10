import React from "react";

import Axios from "../../../../api/axios";
import { useRFI, useImportation } from "../ImportationContext";

const ShipmentForm = () => {
  const { rfiFormData } = useRFI(); // Access RFI context data
  const { handleInputChange } = useImportation(); // Access handleInputChange function from ImportationContext

  const handleSubmitShipment = async (event) => {
    event.preventDefault();
    try {
      // Make a PUT request to submit Shipment information
      const response = await Axios.put(
        `/shipment/submit/${rfiFormData.rfiId}`,
        rfiFormData
      );
      console.log("Shipment submitted:", response.data);
      // Handle success (e.g., show success message)
    } catch (error) {
      console.error("Error submitting Shipment:", error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div>
      <h2>Shipment Form</h2>
      <form onSubmit={handleSubmitShipment}>
        {/* Include form fields here */}
        {/* Example: */}
        <input
          type="date"
          placeholder="Expected Date of Arrival"
          value={rfiFormData.expectedDateOfArrival || ""}
          onChange={(e) =>
            handleInputChange("expectedDateOfArrival", e.target.value)
          }
        />
        {/* Other form fields */}
        <button type="submit">Submit Shipment</button>
      </form>
    </div>
  );
};

export default ShipmentForm;
