// const Data = [
//   {
//     id: "1",
//     drugName: "Panadol",
//     requestedQty: "354",
//     agent: "Benta SAL",
//     notes: "Brand",
//   },
//   {
//     id: "2",
//     drugName: "Zolof",
//     requestedQty: "778",
//     agent: "Omnipharma",
//     notes: "Generic",
//   },
//   {
//     id: "3",
//     drugName: "Nexium",
//     requestedQty: "25",
//     agent: "Pharmaline",
//     notes: "Biological Human",
//   },
//   {
//     id: "4",
//     drugName: "Risperdal",
//     requestedQty: "154",
//     agent: "Mersaco",
//     notes: "Biological Similar",
//     offerType: [
//       {
//         type: "type 1",
//         percentage: "10%",
//       },
//     ],
//   },
// ];

// const orderStatus = [
//   { label: "Pending", value: "pending" },
//   { label: "Approved", value: "approved" },
//   { label: "Corrected", value: "corrected" },
//   { label: "Rejected", value: "Rejected" },
//   { label: "", value: "" },
// ];

// export { Data, orderStatus };
const Data = [
  {
    id: "1",
    drugName: "Panadol",
    requestedQty: "354",
    agent: "Benta SAL",
    notes: "Brand",
    orderStatus: "", // Add orderStatus field with initial value
  },
  {
    id: "2",
    drugName: "Zolof",
    requestedQty: "778",
    agent: "Omnipharma",
    notes: "Generic",
    orderStatus: "", // Add orderStatus field with initial value
  },
  {
    id: "3",
    drugName: "Nexium",
    requestedQty: "25",
    agent: "Pharmaline",
    notes: "Biological Human",
    orderStatus: "", // Add orderStatus field with initial value
  },
  {
    id: "4",
    drugName: "Risperdal",
    requestedQty: "154",
    agent: "Mersaco",
    notes: "Biological Similar",
    offerType: [
      {
        type: "type 1",
        percentage: "10%",
      },
    ],
    orderStatus: "", // Add orderStatus field with initial value
  },
];

const orderStatus = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Corrected", value: "corrected" },
  { label: "Rejected", value: "rejected" },
];

export { Data, orderStatus };
