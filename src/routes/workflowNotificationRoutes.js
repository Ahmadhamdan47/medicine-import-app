const express = require('express');
const router = express.Router();
const WorkflowNotificationController = require('../controllers/workflowNotificationController');

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get pending notifications for the current user based on their role
 *     tags: [Notifications]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: userRole
 *         required: true
 *         schema:
 *           type: string
 *           enum: [agent, import_export, quality_committee, pricing_committee, admin]
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                   drugId:
 *                     type: string
 *                   drugName:
 *                     type: string
 *                   stepNumber:
 *                     type: integer
 *                   message:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: User ID is required
 *       500:
 *         description: Server error
 */
router.get('/', WorkflowNotificationController.getNotifications);

/**
 * @swagger
 * /notifications/acknowledge:
 *   post:
 *     summary: Mark notifications as acknowledged
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               drugId:
 *                 type: string
 *                 required: true
 *               stepNumber:
 *                 type: integer
 *                 required: true
 *               userId:
 *                 type: string
 *                 required: true
 *     responses:
 *       200:
 *         description: Notification acknowledged successfully
 *       400:
 *         description: Bad request - missing required fields
 *       404:
 *         description: Workflow not found
 */
router.post('/acknowledge', WorkflowNotificationController.acknowledgeNotification);

/**
 * @swagger
 * /notifications/stats:
 *   get:
 *     summary: Get notification statistics for dashboard
 *     tags: [Notifications]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: userRole
 *         required: true
 *         schema:
 *           type: string
 *           enum: [agent, import_export, quality_committee, pricing_committee, admin]
 *     responses:
 *       200:
 *         description: Notification statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 pending_import_export:
 *                   type: integer
 *                 pending_quality:
 *                   type: integer
 *                 pending_pricing:
 *                   type: integer
 *                 approved:
 *                   type: integer
 *                 rejected:
 *                   type: integer
 *       400:
 *         description: User ID is required
 *       500:
 *         description: Server error
 */
router.get('/stats', WorkflowNotificationController.getNotificationStats);

module.exports = router;
