const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const FirebaseToken = sequelize.define('firebase_tokens', {
    TokenId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    Token: {
        type: DataTypes.STRING(512),
        allowNull: false,
    },
    CreatedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'firebase_tokens',
    timestamps: false,
});

module.exports = FirebaseToken;
