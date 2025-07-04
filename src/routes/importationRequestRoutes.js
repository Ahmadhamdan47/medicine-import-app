// Importation Request routes
const express = require('express');
const router = express.Router();
const ImportationRequestController = require('../controllers/importationRequestController');
const { authenticateToken, authorizeRoles, authorizeOwnerOrAdmin } = require('../middlewares/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     ImportationRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         agentId:
 *           type: integer
 *         drugName:
 *           type: string
 *         brandName:
 *           type: string
 *         quantityRequested:
 *           type: integer
 *         unitPrice:
 *           type: number
 *         totalValue:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, under_review, rfd_required, proforma_required, swift_required, shipping, inspection, approved, rejected]
 *         urgencyLevel:
 *           type: string
 *           enum: [low, medium, high, critical]
 *         purpose:
 *           type: string
 *         remarks:
 *           type: string
 *         createdDate:
 *           type: string
 *           format: date-time
 *     CreateImportationRequest:
 *       type: object
 *       required:
 *         - drugName
 *         - quantityRequested
 *       properties:
 *         drugName:
 *           type: string
 *         brandName:
 *           type: string
 *         manufacturerId:
 *           type: integer
 *         quantityRequested:
 *           type: integer
 *         unitPrice:
 *           type: number
 *         urgencyLevel:
 *           type: string
 *           enum: [low, medium, high, critical]
 *         purpose:
 *           type: string
 *     UpdateImportationRequest:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *         remarks:
 *           type: string
 *         urgencyLevel:
 *           type: string
 *         purpose:
 *           type: string
 *     ShippingInfo:
 *       type: object
 *       properties:
 *         shippingMethod:
 *           type: string
 *         estimatedArrival:
 *           type: string
 *           format: date-time
 *         actualArrival:
 *           type: string
 *           format: date-time
 *         borderCrossingInfo:
 *           type: string
 *     WarehouseInfo:
 *       type: object
 *       properties:
 *         warehouseLocation:
 *           type: string
 *         batchNumbers:
 *           type: string
 *         inspectionResult:
 *           type: string
 *           enum: [pending, passed, failed, conditional]
 *         inspectionNotes:
 *           type: string
 */

/**
 * @swagger
 * /importation-requests:
 *   post:
 *     summary: Create new importation request
 *     description: Create a new importation request (agent role)
 *     tags: [Importation Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateImportationRequest'
 *     responses:
 *       201:
 *         description: Request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ImportationRequest'
 *       400:
 *         description: Bad request
 *       403:
 *         description: Access denied
 *   get:
 *     summary: List importation requests
 *     description: Get all importation requests with filtering and pagination
 *     tags: [Importation Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: urgencyLevel
 *         schema:
 *           type: string
 *       - in: query
 *         name: agentId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 requests:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ImportationRequest'
 *                 totalCount:
 *                   type: integer
*                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 */
router.post('/', authenticateToken, authorizeRoles('agent', 'import_export', 'admin'), ImportationRequestController.createImportationRequest);
router.get('/', authenticateToken, ImportationRequestController.getAllImportationRequests);

/**
 * @swagger
 * /importation-requests/export-csv:
 *   get:
 *     summary: Export requests to CSV
 *     description: Export importation requests to CSV format
 *     tags: [Importation Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: urgencyLevel
 *         schema:
 *           type: string
 *       - in: query
 *         name: agentId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: CSV file generated successfully
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       500:
 *         description: Error generating CSV
 */
router.get('/export-csv', authenticateToken, ImportationRequestController.exportToCSV);

/**
 * @swagger
 * /importation-requests/{id}:
 *   get:
 *     summary: Get importation request by ID
 *     description: Get detailed information about a specific importation request
 *     tags: [Importation Requests]
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
 *         description: Request retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ImportationRequest'
 *       404:
 *         description: Request not found
 *   patch:
 *     summary: Update importation request
 *     description: Update editable fields of an importation request
 *     tags: [Importation Requests]
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
 *             $ref: '#/components/schemas/UpdateImportationRequest'
 *     responses:
 *       200:
 *         description: Request updated successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Access denied
 *   delete:
 *     summary: Delete importation request
 *     description: Delete an importation request (admin only)
 *     tags: [Importation Requests]
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
 *         description: Request deleted successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Request not found
 */
router.get('/:id', authenticateToken, ImportationRequestController.getImportationRequestById);
router.patch('/:id', authenticateToken, ImportationRequestController.updateImportationRequest);
router.put('/:id', authenticateToken, ImportationRequestController.updateImportationRequest); // Alias for PATCH
router.delete('/:id', authenticateToken, authorizeRoles('admin'), ImportationRequestController.deleteImportationRequest);

/**
 * @swagger
 * /importation-requests/{id}/shipping:
 *   patch:
 *     summary: Update shipping information
 *     description: Update shipping method, ETA, and border crossing info
 *     tags: [Importation Requests]
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
 *             $ref: '#/components/schemas/ShippingInfo'
 *     responses:
 *       200:
 *         description: Shipping information updated successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Access denied
 */
router.patch('/:id/shipping', authenticateToken, authorizeRoles('head_pharmacy', 'import_export', 'admin'), ImportationRequestController.updateShippingInfo);

/**
 * @swagger
 * /importation-requests/{id}/status:
 *   patch:
 *     summary: Update importation request status
 *     description: Update the status of an importation request (Import/Export or Admin only)
 *     tags: [Importation Requests]
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
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, under_review, rfd_required, proforma_required, swift_required, shipping, inspection, approved, rejected]
 *               comments:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Access denied
 */
router.patch('/:id/status', authenticateToken, authorizeRoles('import_export', 'admin'), ImportationRequestController.updateStatus);

/**
 * @swagger
 * /importation-requests/{id}/warehouse:
 *   patch:
 *     summary: Update warehouse information
 *     description: Update warehouse info and batch details
 *     tags: [Importation Requests]
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
 *             $ref: '#/components/schemas/WarehouseInfo'
 *     responses:
 *       200:
 *         description: Warehouse information updated successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Access denied
 */
router.patch('/:id/warehouse', authenticateToken, authorizeRoles('inspector', 'import_export', 'admin'), ImportationRequestController.updateWarehouseInfo);

/**
 * @swagger
 * /importation-requests/bulk-status:
 *   patch:
 *     summary: Bulk status update
 *     description: Update status of multiple importation requests
 *     tags: [Importation Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - requestIds
 *               - status
 *             properties:
 *               requestIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bulk update completed
 *       400:
 *         description: Bad request
 *       403:
 *         description: Access denied
 */
router.patch('/bulk-status', authenticateToken, authorizeRoles('import_export', 'admin'), ImportationRequestController.bulkUpdateStatus);

/**
 * @swagger
 * /importation-requests/bulk:
 *   post:
 *     summary: Bulk operations on importation requests
 *     description: Perform bulk operations on multiple importation requests
 *     tags: [Importation Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               operation:
 *                 type: string
 *                 enum: [updateStatus, delete, export]
 *               requestIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               data:
 *                 type: object
 *     responses:
 *       200:
 *         description: Bulk operation completed successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Access denied
 */
router.post('/bulk', authenticateToken, authorizeRoles('import_export', 'admin'), ImportationRequestController.bulkOperations);

module.exports = router;
