import React from "react";

import Distribution from "./Distribution";
import GlobalPagesLayouts from "../../GlobalPagesLayouts";

const DistributionPage = () => {
  // Sample data
  const orderData = [
    {
      orderId: 1,
      rfi: "RFI-123",
      result: "Passed",
      pi: "PI-456",
      swift: "SW-789",
      invoice: "INV-321",
      rfd: "RFD-654",
      stock: "In Stock",
      pos: "POS-987",
    },
    // Add more data as needed
  ];

  return (
    <div>
      <GlobalPagesLayouts title="Distribution">
        <Distribution data={orderData}/>
      </GlobalPagesLayouts>
    </div>
  );
};

export default DistributionPage;
