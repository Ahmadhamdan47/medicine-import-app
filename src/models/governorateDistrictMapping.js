const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const GovernorateDistrictMapping = sequelize.define('GovernorateDistrictMapping', {
    GovernorateId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'Governorate',
            key: 'GovernorateId',
        }
    },
    DistrictId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'District',
            key: 'DistrictId',
        }
    }
}, {
    tableName: 'governoratedistrictmapping',
    timestamps: false
});

module.exports = GovernorateDistrictMapping;