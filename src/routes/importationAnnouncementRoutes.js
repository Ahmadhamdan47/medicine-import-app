// Importation Announcement routes
const express = require('express');
const router = express.Router();
const ImportationAnnouncementController = require('../controllers/importationAnnouncementController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     ImportationAnnouncement:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         type:
 *           type: string
 *           enum: [general, urgent, policy, deadline, maintenance]
 *         priority:
 *           type: string
 *           enum: [low, medium, high, critical]
 *         targetRole:
 *           type: string
 *           nullable: true
 *         isActive:
 *           type: boolean
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         attachmentFileId:
 *           type: string
 *         metadata:
 *           type: object
 *         viewCount:
 *           type: integer
 *         createdDate:
 *           type: string
 *           format: date-time
 *     CreateAnnouncement:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         type:
 *           type: string
 *           enum: [general, urgent, policy, deadline, maintenance]
 *         priority:
 *           type: string
 *           enum: [low, medium, high, critical]
 *         targetRole:
 *           type: string
 *         isActive:
 *           type: boolean
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         attachmentFileId:
 *           type: string
 *         metadata:
 *           type: object
 *     UpdateAnnouncement:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         type:
 *           type: string
 *         priority:
 *           type: string
 *         targetRole:
 *           type: string
 *         isActive:
 *           type: boolean
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /importation-announcements:
 *   post:
 *     summary: Create announcement
 *     description: Create a new importation announcement (import_export role)
 *     tags: [Importation Announcements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAnnouncement'
 *     responses:
 *       201:
 *         description: Announcement created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ImportationAnnouncement'
 *       400:
 *         description: Bad request
 *       403:
 *         description: Access denied
 *   get:
 *     summary: List visible announcements
 *     description: Get all importation announcements visible to the current user
 *     tags: [Importation Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [general, urgent, policy, deadline, maintenance]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high, critical]
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Announcements retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ImportationAnnouncement'
 */
router.post('/', authenticateToken, authorizeRoles('import_export', 'admin'), ImportationAnnouncementController.createAnnouncement);
router.get('/', authenticateToken, ImportationAnnouncementController.getAllAnnouncements);

/**
 * @swagger
 * /importation-announcements/unread-count:
 *   get:
 *     summary: Get unread announcement count
 *     description: Get the count of unread announcements for the current user
 *     tags: [Importation Announcements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     unreadCount:
 *                       type: integer
 *       400:
 *         description: Bad request
 */
router.get('/unread-count', authenticateToken, ImportationAnnouncementController.getUnreadCount);

/**
 * @swagger
 * /importation-announcements/{id}:
 *   get:
 *     summary: Get announcement by ID
 *     description: Get detailed information about a specific announcement
 *     tags: [Importation Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Announcement retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ImportationAnnouncement'
 *       404:
 *         description: Announcement not found
 *   patch:
 *     summary: Update announcement
 *     description: Update an existing announcement
 *     tags: [Importation Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAnnouncement'
 *     responses:
 *       200:
 *         description: Announcement updated successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Access denied
 *   delete:
 *     summary: Delete announcement
 *     description: Remove an announcement
 *     tags: [Importation Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Announcement deleted successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Announcement not found
 */
router.get('/:id', authenticateToken, ImportationAnnouncementController.getAnnouncementById);
router.patch('/:id', authenticateToken, authorizeRoles('import_export', 'admin'), ImportationAnnouncementController.updateAnnouncement);
router.put('/:id', authenticateToken, authorizeRoles('import_export', 'admin'), ImportationAnnouncementController.updateAnnouncement);
router.delete('/:id', authenticateToken, authorizeRoles('import_export', 'admin'), ImportationAnnouncementController.deleteAnnouncement);

/**
 * @swagger
 * /importation-announcements/{id}/view:
 *   post:
 *     summary: Mark announcement as viewed
 *     description: Increment the view count for an announcement
 *     tags: [Importation Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Announcement marked as viewed
 *       400:
 *         description: Bad request
 */
router.post('/:id/view', authenticateToken, ImportationAnnouncementController.markAsViewed);

module.exports = router;
