// index.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('./config/logger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Sample route
app.get('/', (req, res) => {
  res.send('Hello, Medicine Import App!');
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
