import React from "react";

import { useRFI } from "../ImportationContext";

const RFD = () => {
  const { rfiFormData } = useRFI(); // Access RFI context data
  const [isReceived, setIsReceived] = useState(false); // Local state for isReceived

  const handleReceiveRFD = async () => {
    try {
      // Make a PUT request to receive RFD declaration
      const response = await Axios.put(`/api/rfds/${rfiFormData.rfiId}/receive`);
      console.log("RFD received:", response.data);
      setIsReceived(true); // Update local state
    } catch (error) {
      console.error("Error receiving RFD:", error);
    }
  };

  return (
    <div>
      <h2>RFD Form</h2>
      {isReceived ? (
        <p>RFD declaration received successfully!</p>
      ) : (
        <button onClick={handleReceiveRFD}>Receive RFD</button>
      )}
    </div>
  );
};

export default RFD;
