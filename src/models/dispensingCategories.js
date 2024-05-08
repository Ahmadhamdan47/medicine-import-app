const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const DispensingConditions = sequelize.define('dispensingconditions', {
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    dispensingCondition: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'dispensingconditions',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = DispensingConditions;