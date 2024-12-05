const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const Notification = sequelize.define('notification', {
    NotificationId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    Title: {
        type: DataTypes.STRING(255),
    },
    Message: {
        type: DataTypes.TEXT,
    },
    IsRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    CreatedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'notification',
    timestamps: false,
});

module.exports = Notification;
