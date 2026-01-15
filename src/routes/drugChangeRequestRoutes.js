// src/routes/drugChangeRequestRoutes.js
const express = require('express');
const router = express.Router();
const DrugChangeRequestController = require('../controllers/drugChangeRequestController');

// Note: These routes should be protected with authentication middleware
// Add your authentication middleware here: const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Drug Change Requests
 *   description: API for managing drug edit approval workflow
 */

/**
 * @swagger
 * /drug-change-requests:
 *   post:
 *     summary: Submit a new change request
 *     tags: [Drug Change Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - drugId
 *               - changes
 *             properties:
 *               drugId:
 *                 type: integer
 *                 description: ID of the drug to be edited
 *               changes:
 *                 type: object
 *                 description: Object containing field names and new values
 *                 example:
 *                   Price: 25.50
 *                   DrugName: "Updated Drug Name"
 *                   NotMarketed: false
 *     responses:
 *       201:
 *         description: Change request submitted successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', DrugChangeRequestController.submitChangeRequest);

/**
 * @swagger
 * /drug-change-requests:
 *   get:
 *     summary: Get all change requests (with optional filters)
 *     tags: [Drug Change Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Filter by status
 *       - in: query
 *         name: drugId
 *         schema:
 *           type: integer
 *         description: Filter by drug ID
 *       - in: query
 *         name: requestedBy
 *         schema:
 *           type: integer
 *         description: Filter by requester user ID
 *     responses:
 *       200:
 *         description: List of change requests
 *       500:
 *         description: Server error
 */
router.get('/', DrugChangeRequestController.getAllRequests);

/**
 * @swagger
 * /drug-change-requests/pending:
 *   get:
 *     summary: Get all pending change requests
 *     tags: [Drug Change Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: drugId
 *         schema:
 *           type: integer
 *         description: Filter by drug ID
 *       - in: query
 *         name: requestedBy
 *         schema:
 *           type: integer
 *         description: Filter by requester user ID
 *     responses:
 *       200:
 *         description: List of pending change requests
 *       500:
 *         description: Server error
 */
router.get('/pending', DrugChangeRequestController.getPendingRequests);

/**
 * @swagger
 * /drug-change-requests/statistics:
 *   get:
 *     summary: Get statistics about change requests
 *     tags: [Drug Change Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/statistics', DrugChangeRequestController.getStatistics);

/**
 * @swagger
 * /drug-change-requests/drug/{drugId}/my-pending:
 *   get:
 *     summary: Get current user's pending changes for a drug (restore unsaved edits)
 *     tags: [Drug Change Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: drugId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Drug ID
 *     responses:
 *       200:
 *         description: Pending changes retrieved (or null if none)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/drug/:drugId/my-pending', DrugChangeRequestController.getMyPendingChanges);

/**
 * @swagger
 * /drug-change-requests/drug/{drugId}/with-pending:
 *   get:
 *     summary: Get drug data merged with user's pending changes
 *     tags: [Drug Change Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: drugId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Drug ID
 *     responses:
 *       200:
 *         description: Drug data with pending changes merged
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Drug not found
 *       500:
 *         description: Server error
 */
router.get('/drug/:drugId/with-pending', DrugChangeRequestController.getDrugWithPendingChanges);

/**
 * @swagger
 * /drug-change-requests/history/{drugId}:
 *   get:
 *     summary: Get change history for a specific drug
 *     tags: [Drug Change Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: drugId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Drug ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of history records to return
 *     responses:
 *       200:
 *         description: Change history retrieved successfully
 *       400:
 *         description: Invalid drug ID
 *       500:
 *         description: Server error
 */
router.get('/history/:drugId', DrugChangeRequestController.getChangeHistory);

/**
 * @swagger
 * /drug-change-requests/{id}:
 *   get:
 *     summary: Get a specific change request with before/after comparison
 *     tags: [Drug Change Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Change request ID
 *     responses:
 *       200:
 *         description: Change request details retrieved successfully
 *       404:
 *         description: Change request not found
 *       500:
 *         description: Server error
 */
router.get('/:id', DrugChangeRequestController.getChangeRequestById);

/**
 * @swagger
 * /drug-change-requests/{id}/approve:
 *   put:
 *     summary: Approve a change request and apply changes (Admin only)
 *     tags: [Drug Change Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Change request ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comments:
 *                 type: string
 *                 description: Optional admin comments
 *     responses:
 *       200:
 *         description: Change request approved and applied successfully
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Change request not found
 *       500:
 *         description: Server error
 */
router.put('/:id/approve', DrugChangeRequestController.approveChangeRequest);

/**
 * @swagger
 * /drug-change-requests/{id}/reject:
 *   put:
 *     summary: Reject a change request (Admin only)
 *     tags: [Drug Change Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Change request ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comments:
 *                 type: string
 *                 description: Optional admin comments explaining rejection
 *     responses:
 *       200:
 *         description: Change request rejected successfully
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Change request not found
 *       500:
 *         description: Server error
 */
router.put('/:id/reject', DrugChangeRequestController.rejectChangeRequest);

/**
 * @swagger
 * /drug-change-requests/{id}/update:
 *   put:
 *     summary: Update an existing pending change request
 *     tags: [Drug Change Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Change request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - changes
 *             properties:
 *               changes:
 *                 type: object
 *                 description: Updated changes
 *     responses:
 *       200:
 *         description: Change request updated successfully
 *       403:
 *         description: Forbidden - Can only update own pending requests
 *       404:
 *         description: Change request not found
 *       500:
 *         description: Server error
 */
router.put('/:id/update', DrugChangeRequestController.updatePendingRequest);

/**
 * @swagger
 * /drug-change-requests/{id}/cancel:
 *   delete:
 *     summary: Cancel/delete a pending change request
 *     tags: [Drug Change Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Change request ID
 *     responses:
 *       200:
 *         description: Change request canceled successfully
 *       403:
 *         description: Forbidden - Can only cancel own pending requests
 *       404:
 *         description: Change request not found
 *       500:
 *         description: Server error
 */
router.delete('/:id/cancel', DrugChangeRequestController.cancelPendingRequest);

module.exports = router;
