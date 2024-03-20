// module.exports = {
//   // The swaggerDefinition object contains information about the API
//   swaggerDefinition: {
//     // The OpenAPI version
//     openapi: "3.0.0",

//     // Information about the API
//     info: {
//       // The title of the API
//       title: "MedLeb API",

//       // The version of the API
//       version: "1.0.0",

//       // A description of the API
//       description: "API documentation for Medicine Import App",
//     },

//     // An array of servers where the API is hosted
//     servers: [
//       {
//         // The URL of the server
//         url: "http://localhost:9000",

//         // A description of the server
//         description: "Local Development Server",
//       },
//     ],
//   },

//   // An array of paths to the API route files
//   apis: [
//     "./src/routes/*.js", // Include all route files in the specified directory
//     "./src/routes/drugRoutes.js", // Include the specific route file containing the operation
//   ],
// };
// swagger.js
module.exports = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "MedLeb API",
      version: "1.0.0",
      description: "API documentation for Medicine Import App",
    },
    servers: [
      {
        url: "http://localhost:9000",
        description: "Local Development Server",
      },
    ],
    tags: [
      { name: "Drug", description: "Operations related to drugs" },
      { name: "Donation", description: "Operations related to donations" },
      {
        name: "Importation",
        description: "Operations related to importations",
      },
    ],
  },
  apis: [
    "./src/routes/*.js", // Include all route files in the specified directory
    // Add paths to other Swagger configuration files
  ],
};
