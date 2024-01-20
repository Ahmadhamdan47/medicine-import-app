// config/swagger.js

module.exports = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Medicine Import API',
        version: '1.0.0',
        description: 'API documentation for Medicine Import App',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Local Development Server',
        },
      ],
    },
    apis: ['./src/routes/*.js'],
  };
  