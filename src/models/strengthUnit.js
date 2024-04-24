const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const Strength = sequelize.define('strengthUnit', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    value: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'StrengthUnit',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = Strength;