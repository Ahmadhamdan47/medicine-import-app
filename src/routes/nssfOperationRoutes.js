const express = require('express');
const router = express.Router();
const nssfOperationController = require('../controllers/nssfOperationController');

/**
 * @swagger
 * components:
 *   schemas:
 *     NSSFOperation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Operation ID
 *         name:
 *           type: string
 *           description: Operation name
 *         nameAR:
 *           type: string
 *           description: Operation name in Arabic
 *         description:
 *           type: string
 *           description: Operation description
 *         categoryPricing:
 *           type: object
 *           description: Category pricing information
 *         nssfCoverage:
 *           type: object
 *           description: NSSF coverage information
 *         patientShare:
 *           type: object
 *           description: Patient share calculation
 *         operationSystem:
 *           type: object
 *           description: Operation system information
 */

/**
 * @swagger
 * /nssf-operations/private/system/{system}:
 *   get:
 *     summary: Search NSSF operations by system for private hospitals
 *     tags: [NSSF Operations]
 *     parameters:
 *       - in: path
 *         name: system
 *         required: true
 *         schema:
 *           type: string
 *         description: System name or Arabic name
 *     responses:
 *       200:
 *         description: List of NSSF operations for private hospitals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NSSFOperation'
 *       500:
 *         description: Server error
 */
router.get('/private/system/:system', nssfOperationController.searchNSSFOperationsBySystemPrivate);

/**
 * @swagger
 * /nssf-operations/public/system/{system}:
 *   get:
 *     summary: Search NSSF operations by system for public hospitals
 *     tags: [NSSF Operations]
 *     parameters:
 *       - in: path
 *         name: system
 *         required: true
 *         schema:
 *           type: string
 *         description: System name or Arabic name
 *     responses:
 *       200:
 *         description: List of NSSF operations for public hospitals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NSSFOperation'
 *       500:
 *         description: Server error
 */
router.get('/public/system/:system', nssfOperationController.searchNSSFOperationsBySystemPublic);

/**
 * @swagger
 * /nssf-operations/private/search/{query}:
 *   get:
 *     summary: Search NSSF operations for private hospitals
 *     tags: [NSSF Operations]
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query for operation name
 *     responses:
 *       200:
 *         description: List of matching NSSF operations for private hospitals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NSSFOperation'
 *       500:
 *         description: Server error
 */
router.get('/private/search/:query', nssfOperationController.searchNSSFOperationsPrivate);

/**
 * @swagger
 * /nssf-operations/public/search/{query}:
 *   get:
 *     summary: Search NSSF operations for public hospitals
 *     tags: [NSSF Operations]
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query for operation name
 *     responses:
 *       200:
 *         description: List of matching NSSF operations for public hospitals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NSSFOperation'
 *       500:
 *         description: Server error
 */
router.get('/public/search/:query', nssfOperationController.searchNSSFOperationsPublic);

/**
 * @swagger
 * /nssf-operations/{operationId}:
 *   get:
 *     summary: Get NSSF operation by ID
 *     tags: [NSSF Operations]
 *     parameters:
 *       - in: path
 *         name: operationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Operation ID
 *       - in: query
 *         name: hospitalType
 *         schema:
 *           type: string
 *           enum: [private, public]
 *           default: private
 *         description: Hospital type (private or public)
 *     responses:
 *       200:
 *         description: NSSF operation details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NSSFOperation'
 *       404:
 *         description: Operation not found
 *       500:
 *         description: Server error
 */
router.get('/:operationId', nssfOperationController.getNSSFOperationById);

/**
 * @swagger
 * /nssf-operations:
 *   get:
 *     summary: Get all NSSF operations
 *     tags: [NSSF Operations]
 *     parameters:
 *       - in: query
 *         name: hospitalType
 *         schema:
 *           type: string
 *           enum: [private, public]
 *           default: private
 *         description: Hospital type (private or public)
 *     responses:
 *       200:
 *         description: List of all NSSF operations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NSSFOperation'
 *       500:
 *         description: Server error
 */
router.get('/', nssfOperationController.getAllNSSFOperations);

module.exports = router;
