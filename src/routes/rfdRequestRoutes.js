// RFD Request routes
const express = require('express');
const router = express.Router();
const multer = require('multer');
const RFDRequestController = require('../controllers/rfdRequestController');
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
 *     RFDRequest:
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
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected, requires_correction]
 *         approvedBy:
 *           type: integer
 *         approvedDate:
 *           type: string
 *           format: date-time
 *         rejectionReason:
 *           type: string
 *         metadata:
 *           type: object
 *     CreateRFDRequest:
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
 *         metadata:
 *           type: object
 *     UpdateRFDStatus:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [approved, rejected, requires_correction]
 *         rejectionReason:
 *           type: string
 */

/**
 * @swagger
 * /rfd-requests:
 *   post:
 *     summary: Create RFD request
 *     description: Upload RFD file & metadata
 *     tags: [RFD Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRFDRequest'
 *     responses:
 *       201:
 *         description: RFD request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/RFDRequest'
 *       400:
 *         description: Bad request
 *       403:
 *         description: Access denied
 *   get:
 *     summary: Get all RFD requests
 *     description: Retrieve all RFD requests with optional filtering
 *     tags: [RFD Requests]
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
 *         description: RFD requests retrieved successfully
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
 *                     $ref: '#/components/schemas/RFDRequest'
 */
router.post('/', authenticateToken, authorizeRoles('agent', 'import_export', 'admin'), RFDRequestController.createRFDRequest);
router.get('/', authenticateToken, RFDRequestController.getAllRFDRequests);

/**
 * @swagger
 * /rfd-requests/{id}:
 *   get:
 *     summary: Get RFD request by ID
 *     description: Get detailed information about a specific RFD request
 *     tags: [RFD Requests]
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
 *         description: RFD request retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/RFDRequest'
 *       404:
 *         description: RFD request not found
 *   patch:
 *     summary: Update RFD status
 *     description: Change status (accept / refuse) of RFD request
 *     tags: [RFD Requests]
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
 *             $ref: '#/components/schemas/UpdateRFDStatus'
 *     responses:
 *       200:
 *         description: RFD status updated successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Access denied
 */
router.get('/:id', authenticateToken, RFDRequestController.getRFDRequestById);
router.patch('/:id', authenticateToken, authorizeRoles('import_export', 'admin'), RFDRequestController.updateRFDStatus);
router.patch('/:id/status', authenticateToken, authorizeRoles('import_export', 'admin'), RFDRequestController.updateRFDStatus);

/**
 * @swagger
 * /rfd-requests/upload:
 *   post:
 *     summary: Upload RFD file
 *     description: Upload RFD file with metadata
 *     tags: [RFD Requests]
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
 *               metadata:
 *                 type: string
 *     responses:
 *       201:
 *         description: RFD file uploaded successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Access denied
 */
router.post('/upload', authenticateToken, authorizeRoles('agent', 'import_export', 'admin'), upload.single('file'), RFDRequestController.uploadRFDFile);

module.exports = router;
