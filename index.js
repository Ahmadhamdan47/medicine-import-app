// index.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('./config/logger');
const drugRouter = require('./src/routes/drugRoutes'); 
const submittedOrderRoutes = require('./src/routes/submittedOrderRoutes');
const rfiRoutes = require('./src/routes/rfiRoutes');
const piRoutes = require('./src/routes/piRoutes');
const swiftRoutes = require('./src/routes/swiftRoutes');
const shipmentRoutes = require('./src/routes/shipmentRoutes');
const rfdRoutes = require('./src/routes/rfdRoutes');
const agentStockRoutes = require('./src/routes/agentStockRoutes');
const donorRoutes = require('./src/routes/donorRoutes');
const recipientRoutes = require('./src/routes/recipientRoutes');
const donationRoutes = require('./src/routes/donationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Use your router
app.use('/drugs', drugRouter);
app.use('/submittedOrders', submittedOrderRoutes);
app.use('/rfi', rfiRoutes);
app.use('/pi', piRoutes);
app.use('/swift', swiftRoutes);
app.use('/shipment', shipmentRoutes);
app.use('/rfd', rfdRoutes);
app.use('/agentStock', agentStockRoutes);
app.use('/donor', donorRoutes);
app.use('/recipient', recipientRoutes);
app.use('/donation', donationRoutes);
// Sample route
app.get('/', (req, res) => {
  res.send('Hello, Medicine Import App!');
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});