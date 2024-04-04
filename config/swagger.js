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
        url: "https://2b5a-85-112-70-8.ngrok-free.app",
        // url: "http://localhost:3000",
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
      {
        name: "ATC",
        description: "Operations related to ATCs",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};
