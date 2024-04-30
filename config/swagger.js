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
        url: "http://localhost:3000",
        description: "Local Development Server",
      },
    ],
    tags: [
      { name: "Drug", description: "Operations related to drugs" },
      { name: "Substitute", description: "Operations related to substitutes" },
      { name: "Donation", description: "Operations related to donations" },
      {
        name: "Importation",
        description: "Operations related to importations",
      },
      {
        name: "ATC",
        description: "Operations related to ATCs",
      },
      {
        name: "Agent",
        description: "Operations related to agents",
      },
      {
        name: "Brand",
        description: "Operations related to brands",
      },
      {
        name: "City",
        description: "Operations related to cities",
      },
      {
        name: "Container Type",
        description: "Operations related to Containers Types",
      },
      {
        name: "Disease ATC",
        description: "Operations related to Disease ATCs",
      },
      {
        name: "Disease Categories",
        description: "Operations related to Disease Categories",
      },
      {
        name: "Dispensing Category",
        description: "Operations related to Dispensing Categories",
      },
      {
        name: "Drug Interaction",
        description: "Operations related to Drugs Interactions",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};
