// Import the winston library, a logging library for Node.js
const winston = require('winston');

// Create a new logger instance with two transports: Console and File
const logger = winston.createLogger({
  // The transports option specifies where the logs should be outputted
  transports: [
    // The Console transport outputs the logs to the console
    new winston.transports.Console(),
    
    // The File transport outputs the logs to a file
    // In this case, the file is named 'logfile.log'
    new winston.transports.File({ filename: 'logfile.log' }),
  ],
  
  // The format option specifies how the logs should be formatted
  format: winston.format.combine(
    // The timestamp format prepends a timestamp to the logs
    winston.format.timestamp(),
    
    // The simple format outputs the logs in a simple, readable format
    winston.format.simple()
  ),
});

// Export the logger instance to be used in other parts of the application
module.exports = logger;