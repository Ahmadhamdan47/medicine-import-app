import Axios from "axios";
import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";

import { useImportation } from "../ImportationContext";

const SubmittedOrderForm = () => {
  const { saveRFI } = useImportation();
  const [guid, setGuid] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const generatedGUID = uuidv4(guid);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Make a POST request to submit the order
      const response = await Axios.post("/submit", {
        guid: generatedGUID,
        quantity,
      });
      console.log(generatedGUID);
      // Handle success
      setSuccessMessage(response.data.message);

      // Save RFI data
      await saveRFI(); // Assuming this function saves RFI data to the server
    } catch (error) {
      // Handle error
      setError(`Error submitting order: ${  error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Submit Order</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="text"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default SubmittedOrderForm;
