// Proforma Request routes
const express = require('express');
const router = express.Router();
const multer = require('multer');
const ProformaRequestController = require('../controllers/proformaRequestController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     ProformaRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         importationRequestId:
 *           type: integer
 *         fileId:
 *           type: string
 *         fileName:
 *           type: string
 *         filePath:
 *           type: string
 *         fileSize:
 *           type: integer
 *         checksum:
 *           type: string
 *         invoiceNumber:
 *           type: string
 *         invoiceDate:
 *           type: string
 *           format: date
 *         totalAmount:
 *           type: number
 *         currency:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, signed, rejected, requires_correction]
 *         signedBy:
 *           type: integer
 *         signedDate:
 *           type: string
 *           format: date-time
 *         rejectionReason:
 *           type: string
 *         metadata:
 *           type: object
 *     CreateProformaRequest:
 *       type: object
 *       required:
 *         - importationRequestId
 *       properties:
 *         importationRequestId:
 *           type: integer
 *         fileId:
 *           type: string
 *         fileName:
 *           type: string
 *         invoiceNumber:
 *           type: string
 *         invoiceDate:
 *           type: string
 *           format: date
 *         totalAmount:
 *           type: number
 *         currency:
 *           type: string
 *         metadata:
 *           type: object
 *     UpdateProformaStatus:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [signed, rejected, requires_correction]
 *         rejectionReason:
 *           type: string
 */

/**
 * @swagger
 * /proforma-requests:
 *   post:
 *     summary: Create Proforma request
 *     description: Upload Pro-forma file & metadata
 *     tags: [Proforma Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProformaRequest'
 *     responses:
 *       201:
 *         description: Proforma request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ProformaRequest'
 *       400:
 *         description: Bad request
 *       403:
 *         description: Access denied
 *   get:
 *     summary: Get all Proforma requests
 *     description: Retrieve all Proforma requests with optional filtering
 *     tags: [Proforma Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: importationRequestId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proforma requests retrieved successfully
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
 *                     $ref: '#/components/schemas/ProformaRequest'
 */
router.post('/', authenticateToken, authorizeRoles('agent', 'import_export', 'admin'), ProformaRequestController.createProformaRequest);
router.get('/', authenticateToken, ProformaRequestController.getAllProformaRequests);

/**
 * @swagger
 * /proforma-requests/{id}:
 *   get:
 *     summary: Get Proforma request by ID
 *     description: Get detailed information about a specific Proforma request
 *     tags: [Proforma Requests]
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
 *         description: Proforma request retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ProformaRequest'
 *       404:
 *         description: Proforma request not found
 *   patch:
 *     summary: Update Proforma status
 *     description: Sign / reject Proforma request
 *     tags: [Proforma Requests]
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
 *             $ref: '#/components/schemas/UpdateProformaStatus'
 *     responses:
 *       200:
 *         description: Proforma status updated successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Access denied
 */
router.get('/:id', authenticateToken, ProformaRequestController.getProformaRequestById);
router.patch('/:id', authenticateToken, authorizeRoles('import_export', 'head_pharmacy', 'admin'), ProformaRequestController.updateProformaStatus);

// Also support /sign endpoint for consistency  
router.patch('/:id/sign', authenticateToken, authorizeRoles('import_export', 'head_pharmacy', 'admin'), ProformaRequestController.updateProformaStatus);

/**
 * @swagger
 * /proforma-requests/upload:
 *   post:
 *     summary: Upload Proforma file
 *     description: Upload Pro-forma file with metadata
 *     tags: [Proforma Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               importationRequestId:
 *                 type: integer
 *               invoiceNumber:
 *                 type: string
 *               invoiceDate:
 *                 type: string
 *                 format: date
 *               totalAmount:
 *                 type: number
 *               currency:
 *                 type: string
 *               metadata:
 *                 type: string
 *     responses:
 *       201:
 *         description: Proforma file uploaded successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Access denied
 */
router.post('/upload', authenticateToken, authorizeRoles('agent', 'import_export', 'admin'), upload.single('file'), ProformaRequestController.uploadProformaFile);

module.exports = router;
