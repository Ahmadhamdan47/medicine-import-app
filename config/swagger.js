// config/swagger.js

// Export the Swagger configuration
module.exports = {
    // The swaggerDefinition object contains information about the API
    swaggerDefinition: {
      // The OpenAPI version
      openapi: '3.0.0',
      
      // Information about the API
      info: {
        // The title of the API
        title: 'Medicine Import API',
        
        // The version of the API
        version: '1.0.0',
        
        // A description of the API
        description: 'API documentation for Medicine Import App',
      },
      
      // An array of servers where the API is hosted
      servers: [
        {
          // The URL of the server
          url: 'http://localhost:3000',
          
          // A description of the server
          description: 'Local Development Server',
        },
      ],
    },
    
    // An array of paths to the API route files
    apis: ['./src/routes/*.js'],
  };