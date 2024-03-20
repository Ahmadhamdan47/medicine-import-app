const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacyNew');

const DiseaseCategoryATC = sequelize.define('DiseaseCategoryATC', {
    MappingId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    DiseaseCategoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'DiseaseCategory',
            key: 'DiseaseCategoryId'
        }
    },
    ATC_CodeId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'ATC_Code',
            key: 'ATC_ID'
        }
    }
}, {
    tableName: 'DiseaseCategoryATC',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = DiseaseCategoryATC;