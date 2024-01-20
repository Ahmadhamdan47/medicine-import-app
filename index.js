// index.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const logger = require('./config/logger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Swagger setup
const swaggerOptions = require('./config/swagger');
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Sample route
app.get('/', (req, res) => {
  res.send('Hello, Medicine Import App!');
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
