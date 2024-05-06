const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const DistrictCityMapping = sequelize.define('DistrictCityMapping', {
    DistrictId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'District',
            key: 'DistrictId'
        }
    },
    CityId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'City',
            key: 'CityId'
        }
    }
}, {
    tableName: 'districtcitymapping',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = DistrictCityMapping;