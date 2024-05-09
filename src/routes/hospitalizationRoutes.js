const express = require('express');
const router = express.Router();
const hospitalizationController = require('../controllers/hospitalizationController');
/**
 * @swagger
 * /operations/{system}:
 *   get:
 *     summary: Retrieve a list of operations by system
 *     parameters:
 *       - in: path
 *         name: system
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of operations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Operation'
 */
router.get('/operations/private/:system', hospitalizationController.searchOperationsBySystemPrivate);

/**
 * @swagger
 * /public-operations/{system}:
 *   get:
 *     summary: Retrieve a list of public operations by system
 *     parameters:
 *       - in: path
 *         name: system
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of public operations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Operation'
 */
router.get('/operations/public/:system', hospitalizationController.searchOperationsBySystemPublic);
/**
 * @swagger
 * /operation/private/{query}:
 *   get:
 *     summary: Retrieve a list of private operations by query
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of private operations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Operation'
 */
router.get('/operation/Searchprivate/:query', hospitalizationController.searchOperationPrivate);
/**
 * @swagger
 * /operation/public/{query}:
 *   get:
 *     summary: Retrieve a list of public operations by query
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of public operations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Operation'
 */
router.get('/operation/Searchpublic/:query', hospitalizationController.searchOperationPublic);
/**
 * @swagger
 * /operation/hospital/{hospitalName}:
 *   get:
 *     summary: Retrieve a list of operations by hospital name
 *     parameters:
 *       - in: path
 *         name: hospitalName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of operations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Operation'
 */
router.get('/operation/hospital/:hospitalName', hospitalizationController.searchOperationByHospitalName);
/**
 * @swagger
 * /operation/{operationId}:
 *   get:
 *     summary: Retrieve an operation by ID
 *     parameters:
 *       - in: path
 *         name: operationId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: An operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Operation'
 */
router.get('/operation/:operationId', hospitalizationController.getOperationById);
router.get('/operations/:id/pricing/private', hospitalizationController.getCategoryPricingByOperationIdPrivate);
router.get('/operations/:id/pricing/public', hospitalizationController.getCategoryPricingByOperationIdPublic);
router.get('/private/:id', hospitalizationController.getOperationShareByOperationIdPrivate);
router.get('/public/:id', hospitalizationController.getOperationShareByOperationIdPublic);
module.exports = router;