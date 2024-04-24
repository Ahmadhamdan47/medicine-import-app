const winston = require('winston');

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logfile.log' }),
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
    ),
});

// Ensure the 'info' and 'error' methods are available
if (!logger.info) {
    logger.info = (message) => {
        console.log(`INFO: ${message}`);
    };
}

if (!logger.error) {
    logger.error = (message) => {
        console.error(`ERROR: ${message}`);
    };
}

module.exports = logger;
