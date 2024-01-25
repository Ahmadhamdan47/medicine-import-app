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
// Sample route
app.get('/', (req, res) => {
  res.send('Hello, Medicine Import App!');
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});