const notificationService = require('../services/notificationService');

const addNotification = async (req, res) => {
    try {
        const newNotification = await notificationService.addNotification(req.body);
        res.status(201).json(newNotification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllNotifications = async (req, res) => {
    try {
        const notifications = await notificationService.getAllNotifications();
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getNotificationById = async (req, res) => {
    try {
        const notification = await notificationService.getNotificationById(req.params.notificationId);
        res.status(200).json(notification);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        await notificationService.markAsRead(req.params.notificationId);
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        await notificationService.deleteNotification(req.params.notificationId);
        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const addFirebaseToken = async (req, res) => {
    try {
        const { token, userId } = req.body;
        const newToken = await notificationService.addFirebaseToken(token, userId);
        res.status(201).json(newToken);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const sendPushNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const response = await notificationService.sendPushNotification(notificationId);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
