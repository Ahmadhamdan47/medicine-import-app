// config/databasePharmacyService.js
const Sequelize = require('sequelize');

const sequelize = new Sequelize('PharmacyService', 'sa', 'Theroadof1', {
        host: 'localhost',
        dialect: 'mssql',
        dialectOptions: {
            instanceName: 'SQLEXPRESS',
        },
        logging: console.log,
        define: {
            timestamps: false,
        },
});

module.exports = sequelize;