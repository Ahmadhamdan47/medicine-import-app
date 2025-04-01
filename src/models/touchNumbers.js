const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const TouchNumbers = sequelize.define('TouchNumbers', {
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
    tableName: 'touch_numbers',
    timestamps: false,
});

module.exports = TouchNumbers;