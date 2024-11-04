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
        url: "http://51.255.135.59:8066",  // Replace with your actual hosted server URL
        description: "Production Server",
      },
    ],

    tags: [
      { name: "Drug", description: "Operations related to drugs" },
      { name: "Submitted Orders", description: "Operations related to submitted orders" },
      { name: "RFI", description: "Operations related to RFI" },
      { name: "PI", description: "Operations related to PI" },
      { name: "SWIFT", description: "Operations related to SWIFT" },
      { name: "Shipment", description: "Operations related to shipment" },
      { name: "RFD", description: "Operations related to RFD" },
      { name: "Agent Stock", description: "Operations related to agent stock" },
      { name: "Donor", description: "Operations related to donors" },
      { name: "Recipient", description: "Operations related to recipients" },
      { name: "Donation", description: "Operations related to donations" },
      { name: "ATC", description: "Operations related to ATCs" },
      { name: "Substitute", description: "Operations related to substitutes" },
      { name: "Interaction", description: "Operations related to drug interactions" },
      { name: "Disease Category", description: "Operations related to disease categories" },
      { name: "Disease ATC", description: "Operations related to Disease ATCs" },
      { name: "City", description: "Operations related to cities" },
      { name: "Brand", description: "Operations related to brands" },
      { name: "Agent", description: "Operations related to agents" },
      { name: "Container Type", description: "Operations related to container types" },
      { name: "Dispensing Category", description: "Operations related to dispensing categories" },
      { name: "Hospitalization", description: "Operations related to hospitalizations" },
      { name: "User", description: "Operations related to users" },
      { name: "Batch Lot", description: "Operations related to batch lots" },
      { name: "Role", description: "Operations related to roles" },
      { name: "Box", description: "Operations related to boxes" },
      { name: "Batch Serial", description: "Operations related to batch serials" },
    ],
  },
  apis: ["./src/routes/*.js"],  // This will auto-generate Swagger docs for your route files
};
