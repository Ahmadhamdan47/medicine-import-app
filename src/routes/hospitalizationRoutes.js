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
router.get('/operations/Searchpublic/:query', hospitalizationController.searchOperationPublic);
/**
 * @swagger
 * /operation/private/{query}:
 *  get:
 *   summary: Retrieve a list of private operations by query
 *  parameters:
 *   - in: path
 *    name: query
 *   required: true
 *  schema:
 *  type: string
 * responses:
 * 200:
 * description: A list of private operations
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Operation'
 * 
 */
router.get('/operations/Searchprivate/:query', hospitalizationController.searchOperationPrivate);
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
router.get('/operations/hospital/:hospitalName', hospitalizationController.searchOperationByHospitalName);
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
router.get('/operations/:operationId', hospitalizationController.getOperationById);
/**
 * @swagger
 * /hospitals:
 *   get:
 *     summary: Retrieve a list of hospitals
 *     responses:
 *       200:
 *         description: A list of hospitals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hospital'
 */
router.get('/hospitals', hospitalizationController.getAllHospitals);
/**
 * @swagger
 * /operations:
 *   get:
 *     summary: Retrieve a list of operations
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
router.get('/operations', hospitalizationController.getAllOperations);
/**
 * @swagger
 * /systems:
 *   get:
 *     summary: Retrieve a list of operation systems
 *     responses:
 *       200:
 *         description: A list of operation systems
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
router.get('/systems', hospitalizationController.getAllOperationSystems);
router.get('/operations/pricing/private/:operationId', hospitalizationController.getCategoryPricingByOperationIdPrivate);
router.get('/operations/pricing/public/:operationId', hospitalizationController.getCategoryPricingByOperationIdPublic);
router.get('/private', hospitalizationController.getOperationSharePrivate);
router.get('/public', hospitalizationController.getOperationSharePublic);
module.exports = router;