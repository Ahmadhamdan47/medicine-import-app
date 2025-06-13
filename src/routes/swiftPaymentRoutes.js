// Swift Payment routes
const express = require('express');
const router = express.Router();
const multer = require('multer');
const SwiftPaymentController = require('../controllers/swiftPaymentController');
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
 *     SwiftPayment:
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
 *         swiftNumber:
 *           type: string
 *         paymentDate:
 *           type: string
 *           format: date
 *         amount:
 *           type: number
 *         currency:
 *           type: string
 *         bankName:
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
 *     CreateSwiftPayment:
 *       type: object
 *       required:
 *         - importationRequestId
 *         - swiftNumber
 *         - amount
 *       properties:
 *         importationRequestId:
 *           type: integer
 *         fileId:
 *           type: string
 *         fileName:
 *           type: string
 *         swiftNumber:
 *           type: string
 *         paymentDate:
 *           type: string
 *           format: date
 *         amount:
 *           type: number
 *         currency:
 *           type: string
 *         bankName:
 *           type: string
 *         metadata:
 *           type: object
 *     UpdateSwiftPaymentStatus:
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
 * /swift-payments:
 *   post:
 *     summary: Create Swift payment
 *     description: Upload Swift payment proof
 *     tags: [Swift Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSwiftPayment'
 *     responses:
 *       201:
 *         description: Swift payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SwiftPayment'
 *       400:
 *         description: Bad request
 *       403:
 *         description: Access denied
 *   get:
 *     summary: Get all Swift payments
 *     description: Retrieve all Swift payments with optional filtering
 *     tags: [Swift Payments]
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
 *         description: Swift payments retrieved successfully
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
 *                     $ref: '#/components/schemas/SwiftPayment'
 */
router.post('/', authenticateToken, authorizeRoles('agent', 'import_export', 'admin'), SwiftPaymentController.createSwiftPayment);
router.get('/', authenticateToken, SwiftPaymentController.getAllSwiftPayments);

/**
 * @swagger
 * /swift-payments/{id}:
 *   get:
 *     summary: Get Swift payment by ID
 *     description: Get detailed information about a specific Swift payment
 *     tags: [Swift Payments]
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
 *         description: Swift payment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SwiftPayment'
 *       404:
 *         description: Swift payment not found
 *   patch:
 *     summary: Update Swift payment status
 *     description: Approve / reject Swift payment
 *     tags: [Swift Payments]
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
 *             $ref: '#/components/schemas/UpdateSwiftPaymentStatus'
 *     responses:
 *       200:
 *         description: Swift payment status updated successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Access denied
 */
router.get('/:id', authenticateToken, SwiftPaymentController.getSwiftPaymentById);
router.patch('/:id', authenticateToken, authorizeRoles('head_pharmacy', 'admin'), SwiftPaymentController.updateSwiftPaymentStatus);

// Also support /approve endpoint for consistency
router.patch('/:id/approve', authenticateToken, authorizeRoles('head_pharmacy', 'admin'), SwiftPaymentController.updateSwiftPaymentStatus);

/**
 * @swagger
 * /swift-payments/upload:
 *   post:
 *     summary: Upload Swift payment file
 *     description: Upload Swift payment proof with metadata
 *     tags: [Swift Payments]
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
 *               swiftNumber:
 *                 type: string
 *               paymentDate:
 *                 type: string
 *                 format: date
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *               bankName:
 *                 type: string
 *               metadata:
 *                 type: string
 *     responses:
 *       201:
 *         description: Swift payment file uploaded successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Access denied
 */
router.post('/upload', authenticateToken, authorizeRoles('agent', 'import_export', 'admin'), upload.single('file'), SwiftPaymentController.uploadSwiftPaymentFile);

module.exports = router;
