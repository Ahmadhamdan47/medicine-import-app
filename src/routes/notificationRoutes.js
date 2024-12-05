const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

/**
 * @swagger
 * /notification/add:
 *   post:
 *     summary: Add a new notification
 *     description: Add a new notification to the system.
 *     tags: [Notification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Title:
 *                 type: string
 *               Message:
 *                 type: string
 *               RecipientId:
 *                 type: integer
 *               IsRead:
 *                 type: boolean
 *     responses:
 *       '201':
 *         description: Notification created successfully.
 */
router.post('/add', notificationController.addNotification);

/**
 * @swagger
 * /notification/all:
 *   get:
 *     summary: Get all notifications
 *     description: Retrieve all notifications from the system.
 *     tags: [Notification]
 *     responses:
 *       '200':
 *         description: List of notifications.
 */
router.get('/all', notificationController.getAllNotifications);

/**
 * @swagger
 * /notification/{notificationId}:
 *   get:
 *     summary: Get a notification by ID
 *     description: Retrieve a specific notification by its ID.
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Notification details.
 */
router.get('/:notificationId', notificationController.getNotificationById);

/**
 * @swagger
 * /notification/markAsRead/{notificationId}:
 *   put:
 *     summary: Mark a notification as read
 *     description: Update a notification's read status to true.
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Notification marked as read.
 */
router.put('/markAsRead/:notificationId', notificationController.markAsRead);

/**
 * @swagger
 * /notification/{notificationId}:
 *   delete:
 *     summary: Delete a notification
 *     description: Remove a notification by its ID.
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Notification deleted successfully.
 */
router.delete('/:notificationId', notificationController.deleteNotification);

module.exports = router;
