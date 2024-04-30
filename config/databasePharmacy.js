// const Sequelize = require("sequelize");
// const winston = require("winston");

// // Configure winston logger
// const logger = winston.createLogger({
//   transports: [
//     new winston.transports.Console(),
//     new winston.transports.File({ filename: "error.log", level: "error" }),
//   ],
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.simple()
//   ),
// });

// // Function to handle errors during Sequelize initialization
// function handleSequelizeError(error) {
//   logger.error("Error occurred while initializing Sequelize:", error);
//   process.exit(1); 
// }

// try {
//   const sequelize = new Sequelize("PharmacyServiceNew", "sa", "1234", {
//     host: "localhost",
//     dialect: "mssql",
//     dialectOptions: {
//       instanceName: "SQLEXPRESS",
//     },
//     logging: (query) => {
//       logger.info(`Executing SQL Query: ${query}`);
//       if (!query || !query.sql) {
//         return; // Exit early if the query or SQL string is undefined
//       }

//       const { sql, bind } = query;
//       let logMessage = `[${new Date().toISOString()}]`;

//       // Extract SQL command (SELECT, INSERT, UPDATE, DELETE)
//       const sqlCommand = sql.split(" ")[0];
//       logMessage += ` ${sqlCommand}`;

//       // Extract table name from SQL query (for SELECT, INSERT INTO)
//       let tableName = "";
//       if (sqlCommand === "SELECT") {
//         tableName = sql.match(/FROM\s+(\w+)/i);
//       } else if (sqlCommand === "INSERT") {
//         tableName = sql.match(/INTO\s+(\w+)/i);
//       } else if (sqlCommand === "UPDATE") {
//         tableName = sql.match(/UPDATE\s+(\w+)/i);
//       } else if (sqlCommand === "DELETE") {
//         tableName = sql.match(/FROM\s+(\w+)/i);
//       }

//       if (tableName && tableName.length > 1) {
//         logMessage += ` ${tableName[1]}`;
//       }

//       // Include bound parameters
//       if (bind) {
//         logMessage += ` with parameters ${JSON.stringify(bind)}`;
//       }

//       logger.info(`Database Query: ${logMessage}`);
//     },
//     define: {
//       timestamps: false,
//     },
//   });

//   // Test the connection to the database
//   sequelize
//     .authenticate()
//     .then(() => {
//       logger.info(
//         "Connection to the database PharmacyService has been established successfully."
//       );

//       // Sync the database models with the database
//       sequelize.sync().then(() => {
//         logger.info("Database models synchronized successfully.");
//       });
//     })
//     .catch(handleSequelizeError);

//   module.exports = sequelize;
// } catch (error) {
//   handleSequelizeError(error);
// }
const Sequelize = require("sequelize");
const winston = require("winston");

// Configure winston logger
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
});

// Function to handle errors during Sequelize initialization
function handleSequelizeError(error) {
  logger.error("Error occurred while initializing Sequelize:", error);
  process.exit(1);
}

try {
  const sequelize = new Sequelize("PharmacyService", "sa", "1234", {
    host: "localhost",
    dialect: "mssql",
    dialectOptions: {
      instanceName: "SQLEXPRESS",
    },
    logging: (query) => {
      logger.info(`Executing SQL Query: ${query}`);
      if (!query || !query.sql) {
        return; // Exit early if the query or SQL string is undefined
      }

      const { sql, bind } = query;
      let logMessage = `[${new Date().toISOString()}]`;

      // Extract SQL command (SELECT, INSERT, UPDATE, DELETE)
      const sqlCommand = sql.split(" ")[0];
      logMessage += ` ${sqlCommand}`;

      // Extract table name from SQL query (for SELECT, INSERT INTO)
      let tableName = "";
      if (sqlCommand === "SELECT") {
        tableName = sql.match(/FROM\s+(\w+)/i);
      } else if (sqlCommand === "INSERT") {
        tableName = sql.match(/INTO\s+(\w+)/i);
      } else if (sqlCommand === "UPDATE") {
        tableName = sql.match(/UPDATE\s+(\w+)/i);
      } else if (sqlCommand === "DELETE") {
        tableName = sql.match(/FROM\s+(\w+)/i);
      }

      if (tableName && tableName.length > 1) {
        logMessage += ` ${tableName[1]}`;
      }

      // Include bound parameters
      if (bind) {
        logMessage += ` with parameters ${JSON.stringify(bind)}`;
      }

      logger.info(`Database Query: ${logMessage}`);
    },
    define: {
      timestamps: false,
    },
  });

  // Test the connection to the database
  sequelize
    .authenticate()
    .then(() => {
      logger.info(
        "Connection to the database PharmacyService has been established successfully."
      );

      // Sync the database models with the database
      sequelize.sync().then(() => {
        logger.info("Database models synchronized successfully.");
      });
    })
    .catch(handleSequelizeError);

  module.exports = sequelize;
} catch (error) {
  handleSequelizeError(error);
}
