// index.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('./config/logger');
const drugRouter = require('./src/routes/drugRoutes'); // Import your router

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Use your router
app.use('/drugs', drugRouter);

// Sample route
app.get('/', (req, res) => {
  res.send('Hello, Medicine Import App!');
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});