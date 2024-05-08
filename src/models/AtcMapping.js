const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const Drug_ATC_Mapping = sequelize.define('drug_atc_mapping', {
    MappingID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    DrugID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'drug',
            key: 'DrugID'
        }
    },
    ATC_ID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'atc',
            key: 'ATC_ID'
        }
    }
}, {
    tableName: 'drug_atc_mapping',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = Drug_ATC_Mapping;