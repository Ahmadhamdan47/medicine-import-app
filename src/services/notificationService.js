const admin = require('../config/firebase');
const Notification = require('../models/notification');
const FirebaseToken = require('../models/fireBaseToken');

const addNotification = async (notificationData) => {
    try {
        const newNotification = await Notification.create(notificationData);
        return newNotification;
    } catch (error) {
        console.error(error);
        throw new Error('Error in notificationService: ' + error.message);
    }
};

const getAllNotifications = async () => {
    try {
        const notifications = await Notification.findAll();
        return notifications;
    } catch (error) {
        console.error(error);
        throw new Error('Error in notificationService: ' + error.message);
    }
};

const getNotificationById = async (notificationId) => {
    try {
        const notification = await Notification.findByPk(notificationId);
        if (!notification) {
            throw new Error('Notification not found');
        }
        return notification;
    } catch (error) {
        console.error(error);
        throw new Error('Error in notificationService: ' + error.message);
    }
};

const markAsRead = async (notificationId) => {
    try {
        const result = await Notification.update({ IsRead: true }, {
            where: { NotificationId: notificationId },
        });
        return result;
    } catch (error) {
        console.error(error);
        throw new Error('Error in notificationService: ' + error.message);
    }
};

const deleteNotification = async (notificationId) => {
    try {
        await Notification.destroy({
            where: { NotificationId: notificationId },
        });
    } catch (error) {
        console.error(error);
        throw new Error('Error in notificationService: ' + error.message);
    }
};
const addFirebaseToken = async (token, userId = null) => {
    try {
        const newToken = await FirebaseToken.create({ Token: token, UserId: userId });
        return newToken;
    } catch (error) {
        console.error('Error adding Firebase token:', error);
        throw new Error('Failed to add Firebase token');
    }
};

const sendPushNotification = async (notificationId) => {
    try {
        // Retrieve the notification message
        const notification = await Notification.findByPk(notificationId);
        if (!notification) throw new Error('Notification not found');

        // Retrieve all Firebase tokens
        const tokens = await FirebaseToken.findAll();
        const tokenList = tokens.map((token) => token.Token);

        if (tokenList.length === 0) throw new Error('No Firebase tokens available');

        // Prepare the Firebase message
        const message = {
            notification: {
                title: notification.Title,
                body: notification.Message,
            },
            tokens: tokenList, // Send to all tokens
        };

        // Send the notification via Firebase
        const response = await admin.messaging().sendMulticast(message);

        console.log('Push notifications sent:', response);
        return response;
    } catch (error) {
        console.error('Error sending push notification:', error);
        throw error;
    }
};
module.exports = {
    addNotification,
    getAllNotifications,
    getNotificationById,
    markAsRead,
    deleteNotification,
    addFirebaseToken,
    sendPushNotification,
};
