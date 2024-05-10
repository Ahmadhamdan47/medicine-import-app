import React from "react";

import Axios from "../../../../api/axios";
import { useRFI, useImportation } from "../ImportationContext";

const SwiftForm = () => {
  const { rfiFormData } = useRFI(); // Access RFI context data
  const { handleInputChange } = useImportation(); // Access handleInputChange function from ImportationContext

  const handleSubmitSwift = async (event) => {
    event.preventDefault();
    try {
      // Make a PUT request to submit Swift information
      const response = await Axios.put(
        `/swift/submit/${rfiFormData.rfiId}`,
        rfiFormData
      );
      console.log("Swift submitted:", response.data);
      // Handle success (e.g., show success message)
    } catch (error) {
      console.error("Error submitting Swift:", error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div>
      <h2>Swift Form</h2>
      <form onSubmit={handleSubmitSwift}>
        {/* Include form fields here */}
        {/* Example: */}
        <input
          type="text"
          placeholder="Swift Number"
          value={rfiFormData.swiftNumber || ""}
          onChange={(e) => handleInputChange("swiftNumber", e.target.value)}
        />
        <input
          type="date"
          placeholder="Date"
          value={rfiFormData.date || ""}
          onChange={(e) => handleInputChange("date", e.target.value)}
        />
        {/* Other form fields */}
        <button type="submit">Submit Swift</button>
      </form>
    </div>
  );
};

export default SwiftForm;
