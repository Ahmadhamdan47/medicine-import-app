const countries = [
  {
    id: 1,
    name: "Country A",
    code: "A",
    governorates: [
      {
        id: 11,
        name: "Governorate A1",
        districts: [
          {
            id: 111,
            name: "District A1.1",
            cities: [{ id: 1111, name: "City A1.1.1" }],
          },
          {
            id: 112,
            name: "District A1.2",
            cities: [
              { id: 1112, name: "City A1.2.1" },
              { id: 1113, name: "City A1.2.2" },
            ],
          },
        ],
      },
      {
        id: 12,
        name: "Governorate A2",
        districts: [
          {
            id: 121,
            name: "District A2.1",
            cities: [
              { id: 1211, name: "City A2.1.1" },
              { id: 1212, name: "City A2.1.2" },
            ],
          },
          {
            id: 122,
            name: "District A2.2",
            cities: [
              { id: 1221, name: "City A2.2.1" },
              { id: 1222, name: "City A2.2.2" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Country B",
    code: "B",
    governorates: [
      {
        id: 21,
        name: "Governorate B1",
        districts: [
          {
            id: 211,
            name: "District B1.1",
            cities: [
              { id: 2111, name: "City B1.1.1" },
              { id: 2112, name: "City B1.1.2" },
            ],
          },
          {
            id: 212,
            name: "District B1.2",
            cities: [{ id: 2121, name: "City B1.2.1" }],
          },
        ],
      },
      {
        id: 22,
        name: "Governorate B2",
        districts: [
          {
            id: 221,
            name: "District B2.1",
            cities: [
              { id: 2211, name: "City B2.1.1" },
              { id: 2212, name: "City B2.1.2" },
            ],
          },
          {
            id: 222,
            name: "District B2.2",
            cities: [
              { id: 2221, name: "City B2.2.1" },
              { id: 2222, name: "City B2.2.2" },
            ],
          },
        ],
      },
    ],
  },
];
export default countries