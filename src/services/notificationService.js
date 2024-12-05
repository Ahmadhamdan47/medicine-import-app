const Notification = require('../models/notification');

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

module.exports = {
    addNotification,
    getAllNotifications,
    getNotificationById,
    markAsRead,
    deleteNotification,
};
