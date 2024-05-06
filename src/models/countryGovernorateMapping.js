const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const CountryGovernorateMapping = sequelize.define('CountryGovernorateMapping', {
    CountryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'Country',
            key: 'CountryId'
        }
    },
    GovernorateId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'Governorate',
            key: 'GovernorateId'
        }
    }
}, {
    tableName: 'countrygovernoratemapping',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = CountryGovernorateMapping;