const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const AlfaNumbers = sequelize.define('AlfaNumbers', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'alfa_numbers',
    timestamps: false,
});

module.exports = AlfaNumbers;