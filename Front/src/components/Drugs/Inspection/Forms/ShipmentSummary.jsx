// import React from "react";

// const ShipmentSummary = ({ formData, batchesQty, batchComponents }) => {
//   return (
//     <div className="shipment-summary">
//       <h2>Shipment Summary</h2>
//       <div>
//         <h3>Shipment Form Data:</h3>
//         <p>Batch Barcode: {formData.batchBarcode}</p>
//         <p>Batch Serials: {formData.batchSerials && formData.batchSerials.join(", ")}</p>

//       </div>
//       <div>
//         <h3>Batches Quantity:</h3>
//         <p>{batchesQty}</p>
//       </div>
//       <div>
//         <h3>Batch Components:</h3>
//         {batchComponents?.length > 0 ? (
//           <ul>
//             {batchComponents.map((batch, index) => (
//               <li key={index}>
//                 <strong>Batch {index + 1}:</strong>
//                 <p>Batch Number: {batch.batchNumber}</p>
//                 <p>Production Date: {batch.productionDate}</p>
//                 <p>Expiry Date: {batch.expiryDate}</p>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No batch components added yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ShipmentSummary;
import React from "react";

const ShipmentSummary = ({ formData, batchesQty, batchComponents }) => (
    <div className="shipment-summary px-4 py-8 sm:px-8 sm:py-12 md:px-12 md:py-16 lg:px-16 lg:py-20 xl:px-20 xl:py-24">
      <h2 className="text-2xl font-semibold mb-6 text-center">Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <h3 className="text-xl font-semibold mb-2">Shipment Form Data:</h3>
          <p className="mb-4">
            <span className="font-bold">Batch Barcode:</span>{" "}
            {formData.batchBarcode}
          </p>
          <div>
            <span className="font-bold">Batch Serials:</span>
            {formData.batchSerials &&
              formData.batchSerials.map((serial, index) => (
                <p key={index} className="ml-2 font-medium">
                  {serial}
                </p>
              ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">Batches Quantity:</h3>
          <p>{batchesQty}</p>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Batch Components:</h3>
        {batchComponents?.length > 0 ? (
          <ul>
            {batchComponents.map((batch, index) => (
              <li key={index} className="mb-6">
                <h4 className="text-lg sm:text-xl font-semibold">
                  Batch {index + 1}:
                </h4>
                <p>
                  <span className="font-semibold">Batch Number:</span>{" "}
                  {batch.batchNumber}
                </p>
                <p>
                  <span className="font-semibold">Production Date:</span>{" "}
                  {batch.productionDate}
                </p>
                <p>
                  <span className="font-semibold">Expiry Date:</span>{" "}
                  {batch.expiryDate}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No batch components added yet.</p>
        )}
      </div>
    </div>
  );

export default ShipmentSummary;
