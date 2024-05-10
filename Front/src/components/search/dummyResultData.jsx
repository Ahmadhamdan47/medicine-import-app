// const dummyResultData = [
//   {
//     name: "CALTRATE",
//     classFilter: "ClassA",
//     classChild1: "A01",
//     classChild2: "A02",
//   },
//   {
//     name: "LIPIDEM",
//     classFilter: "ClassB",
//     classChild1: "B01",
//     classChild2: "B02",
//   },
//   {
//     name: "TRACLEER",
//     classFilter: "ClassC",
//     classChild1: "C01",
//     classChild2: "C02",
//   },
//   {
//     name: "Biafine",
//     classFilter: "ClassD",
//     classChild1: "D01",
//     classChild2: "D02",
//   },
//   {
//     name: "Daktacort",
//     classFilter: "ClassD",
//     classChild1: "D01",
//     classChild2: "D02",
//   },
//   {
//     name: "ECONAZ",
//     classFilter: "ClassG",
//     classChild1: "G01",
//     classChild2: "G02",
//   },
//   {
//     name: "ADCETRIS",
//     classFilter: "ClassL",
//     classChild1: "L01",
//     classChild2: "L02",
//   },
//   {
//     name: "ABRAXANE",
//     classFilter: "ClassL",
//     classChild1: "L01",
//     classChild2: "L02",
//   },
//   {
//     name: "Panadol",
//     classFilter: "ClassN",
//     classChild1: "N01",
//     classChild2: "N02",
//   },
//   {
//     name: "LURABIL",
//     classFilter: "ClassN",
//     classChild1: "N01",
//     classChild2: "N02",
//   },
//   {
//     name: "LENALIDOMIDE",
//     classFilter: "ClassN",
//     classChild1: "N01",
//     classChild2: "N02",
//   },
// ];

// export default dummyResultData;



const dummyResultData = [
  {
    name: "CALTRATE",
    filters: {
      classFilter: "ClassA",
      atcCode: ["A01"],
    },
  },
  {
    name: "LIPIDEM",
    filters: {
      classFilter: "ClassB",
      atcCode: ["B01"],
    },
  },
  {
    name: "TRACLEER",
    filters: {
      classFilter: "ClassC",
      atcCode: ["C01"],
    },
  },
  {
    name: "BIAFINE",
    filters: {
      classFilter: "ClassD",
      atcCode: ["D01"],
    },
  },
  {
    name: "ECONAZ",
    filters: {
      classFilter: "ClassG",
      atcCode: ["G01"],
    },
  },
  {
    name: "ADCETRIS",
    filters: {
      classFilter: "ClassL",
      atcCode: ["L01"],
    },
  },
  {
    name: "ABRAXANE",
    filters: {
      classFilter: "ClassL",
      atcCode: ["L02"],
    },
  },
  {
    name: "PANADOL",
    filters: {
      classFilter: "ClassN",
      atcCode: ["N01"],
    },
  },
  {
    name: "LURABIL",
    filters: {
      classFilter: "ClassN",
      atcCode: ["N02"],
    },
  },
  {
    name: "LENALIDOMIDES",
    filters: {
      classFilter: "ClassN",
      atcCode: ["N03"],
    },
  },
];

export default dummyResultData;
