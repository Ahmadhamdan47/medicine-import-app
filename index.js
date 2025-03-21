const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerConfig = require("./config/swagger");
const bodyParser = require("body-parser");
const logger = require("./config/logger");
const path = require("path");
const sequelize = require("./config/databasePharmacy");
// Remove the built-in cors package usage
// const cors = require("cors");

// Routers
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
const hospitalizationRoutes = require("./src/routes/hospitalizationRoutes");
const userRoutes = require("./src/routes/userRoutes");
const batchLotRoutes = require("./src/routes/batchLotRoutes");
const roleRoutes = require("./src/routes/roleRoutes");
const boxRoutes = require("./src/routes/boxRoutes");
const batchSerialRoutes = require("./src/routes/batchSerialRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const presentationRoutes = require("./src/routes/presentationRoutes");
const dosageRoutes = require("./src/routes/dosageRoutes");
const recipientAgreementsRoutes = require("./src/routes/recipientAgreementsRoutes");
const manufacturerRoutes = require("./src/routes/manufacturerRoutes");
const responsiblPartyRoutes = require("./src/routes/responsiblePartyRoutes");
const bannedDrugsRoutes = require("./src/routes/bannedDrugsRoutes");
const stratumRoutes = require("./src/routes/stratumRoutes");

const app = express();
const PORT = process.env.PORT || 8066;

// --- Swagger Configuration ---
const swaggerSpec = swaggerJSDoc(swaggerConfig);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/swagger-ui", express.static("node_modules/swagger-ui-dist"));
app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// --- Logging Middleware ---
app.use((req, res, next) => {
  logger.info(`[${new Date().toISOString()}] [${req.method}] ${req.url}`);
  next();
});

// --- Body Parser Middleware ---
app.use(bodyParser.json());

// --- Custom CORS Middleware ---
// Define the allowed origins.
const allowedOrigins = [
  "https://ps-new.vercel.app",
  "https://drug-table.vercel.app"
];

app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;
  // If the incoming request's origin is allowed, echo it back.
  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
  }
  // Optionally, you can decide what to do if the origin is not allowed.
  // For example, do not set the header or set it to null.
  
  // Set additional CORS headers
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
// --- End Custom CORS Middleware ---

// --- API Routers ---
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
app.use("/hospitalization", hospitalizationRoutes);
app.use("/users", userRoutes);
app.use("/batchLots", batchLotRoutes);
app.use("/roles", roleRoutes);
app.use("/boxes", boxRoutes);
app.use("/batchserial", batchSerialRoutes);
app.use("/notification", notificationRoutes);
app.use("/presentations", presentationRoutes);
app.use("/dosages", dosageRoutes);
app.use("/recipientAgreements", recipientAgreementsRoutes);
app.use("/manufacturer", manufacturerRoutes);
app.use("/responsibleParty", responsiblPartyRoutes);
app.use("/bannedDrugs", bannedDrugsRoutes);
app.use("/stratum", stratumRoutes);
app.use("/img", express.static("img"));

// --- Serve React Static Files ---
app.use(express.static(path.join(__dirname, "src/views/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "src/views/build", "index.html"));
});

// --- Root Route ---
app.get("/", (req, res) => {
  logger.info(`[${new Date().toISOString()}] [GET] / - Hello, Medicine Import App!`);
  res.send("Hello, Medicine Import App!");
});

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
  logger.error(`[${new Date().toISOString()}] An error occurred: ${err.message}`);
  res.status(500).send("Something went wrong!");
});

// --- Start the Server ---
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

// --- Database Synchronization ---
sequelize.sync()
  .then(() => {
    console.log("Database synchronized successfully!");
  })
  .catch((error) => {
    console.error("Error synchronizing the database:", error);
  });
