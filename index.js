const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerConfig = require("./config/swagger");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("./config/logger");
const drugRouter = require("./src/routes/drugRoutes");
const submittedOrderRoutes = require("./src/routes/submittedOrderRoutes");
const rfiRoutes = require("./src/routes/rfiRoutes");
const piRoutes = require("./src/routes/piRoutes");
const swiftRoutes = require("./src/routes/swiftRoutes");
const shipmentRoutes = require("./src/routes/shipmentRoutes");
const rfdRoutes = require("./src/routes/rfdRoutes");
const agentStockRoutes = require("./src/routes/agentStockRoutes");
const donorRoutes = require("./src/routes/donorRoutes");
const recipientRoutes = require("./src/routes/recipientRoutes");
const donationRoutes = require("./src/routes/donationRoutes");
const atcRoutes = require("./src/routes/atcRoutes");
const substituteRoutes = require("./src/routes/substituteRoutes");
const interactionRoutes = require("./src/routes/interactionRoutes");
const diseaseCategoryRoutes = require("./src/routes/diseaseCategoryRoutes");
const diseaseATCRoutes = require("./src/routes/diseaseATCRoutes");
const cityRoutes = require("./src/routes/cityRoutes");
const brandRoutes = require("./src/routes/brandRoutes");
const agentRoutes = require("./src/routes/agentRoutes");
const containerTypeRoutes = require("./src/routes/containerTypeRoutes");
const dispensingCategoryRoutes = require("./src/routes/dispensingCategoryRoutes");
const HospitalizationRoutes = require("./src/routes/hospitalizationRoutes");

const app = express();
const PORT = process.env.PORT || 3000;



// // Swagger definition
const swaggerSpec = swaggerJSDoc(swaggerConfig);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serve Swagger UI static files
app.use("/swagger-ui", express.static("node_modules/swagger-ui-dist"));

// Serve Swagger specification as JSON
app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Swagger definition
// const swaggerSpec = swaggerJSDoc(swaggerConfig);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serve Swagger UI static files
app.use("/api-docs", express.static("node_modules/swagger-ui-dist"));

// Middleware for logging incoming requests
app.use((req, res, next) => {
  logger.info(`[${new Date().toISOString()}] [${req.method}] ${req.url}`);
  next();
});

app.use(bodyParser.json());
app.use(cors());

// Use your router
app.use("/drugs", drugRouter);
app.use("/submittedOrders", submittedOrderRoutes);
app.use("/rfi", rfiRoutes);
app.use("/pi", piRoutes);
app.use("/swift", swiftRoutes);
app.use("/shipment", shipmentRoutes);
app.use("/rfd", rfdRoutes);
app.use("/agentStock", agentStockRoutes);
app.use("/donor", donorRoutes);
app.use("/recipient", recipientRoutes);
app.use("/donation", donationRoutes);
app.use("/atc", atcRoutes);
app.use("/substitute", substituteRoutes);
app.use("/interaction", interactionRoutes);
app.use("/diseaseCategory", diseaseCategoryRoutes);
app.use("/diseaseATC", diseaseATCRoutes);
app.use("/city", cityRoutes);
app.use("/brand", brandRoutes);
app.use("/agent", agentRoutes);
app.use("/containerType", containerTypeRoutes);
app.use("/dispensingCategory", dispensingCategoryRoutes);
app.use("/hospitalization", HospitalizationRoutes);

// Sample route
app.get("/", (req, res) => {
  logger.info(
    `[${new Date().toISOString()}] [GET] / - Hello, Medicine Import App!`
  );
  res.send("Hello, Medicine Import App!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(
    `[${new Date().toISOString()}] An error occurred: ${err.message}`
  );
  res.status(500).send("Something went wrong!");
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
