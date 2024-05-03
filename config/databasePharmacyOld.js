const Sequelize = require('sequelize');

// Function to handle errors during Sequelize initialization
function handleSequelizeError(error) {
    console.error('Error occurred while initializing Sequelize:', error);
    process.exit(1); // Exit the process with a non-zero status code
}

try {
    const sequelize = new Sequelize("ommal_medapiv2", "ommal_ahmad", "fISfGr^8q!_gUPMY", {
        host: 'localhost',
        dialect: 'mysql',
        logging: console.log,
        define: {
            timestamps: false,
        },
    });

    // Test the connection to the database
    sequelize.authenticate()
        .then(() => {
            console.log('Connection to the database MedLebPharmacyServicesOld has been established successfully.');
        })
        .catch(handleSequelizeError);

    module.exports = sequelize;
} catch (error) {
    handleSequelizeError(error);
}
