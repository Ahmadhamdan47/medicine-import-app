/**
 * Route Cleaning Routes
 * 
 * API endpoints for route cleaning operations.
 * 
 * @module routeCleaningRoutes
 */

const express = require('express');
const router = express.Router();
const routeCleaningController = require('../controllers/routeCleaningController');

/**
 * @swagger
 * /route-cleaning/unique-values:
 *   get:
 *     summary: Get unique RouteRaw values with drug counts
 *     tags: [Route Cleaning]
 *     parameters:
 *       - in: query
 *         name: includeNull
 *         schema:
 *           type: boolean
 *         description: Include null/empty RouteRaw values
 *       - in: query
 *         name: minCount
 *         schema:
 *           type: integer
 *         description: Minimum drug count to include
 *     responses:
 *       200:
 *         description: List of unique RouteRaw values
 *       500:
 *         description: Server error
 */
router.get('/unique-values', routeCleaningController.getUniqueRouteRaw);

/**
 * @swagger
 * /route-cleaning/suggest-matches:
 *   post:
 *     summary: Suggest route matches for a RouteRaw value
 *     tags: [Route Cleaning]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               routeRaw:
 *                 type: string
 *               limit:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Suggestions returned successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.post('/suggest-matches', routeCleaningController.suggestRouteMatch);

/**
 * @swagger
 * /route-cleaning/affected-drugs:
 *   get:
 *     summary: Get drugs affected by a RouteRaw value
 *     tags: [Route Cleaning]
 *     parameters:
 *       - in: query
 *         name: routeRaw
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of affected drugs
 *       400:
 *         description: RouteRaw parameter missing
 *       500:
 *         description: Server error
 */
router.get('/affected-drugs', routeCleaningController.getAffectedDrugs);

/**
 * @swagger
 * /route-cleaning/preview:
 *   post:
 *     summary: Preview route mappings before applying
 *     tags: [Route Cleaning]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mappings:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     routeRaw:
 *                       type: string
 *                     newRoute:
 *                       type: string
 *     responses:
 *       200:
 *         description: Preview data
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.post('/preview', routeCleaningController.previewRouteMapping);

/**
 * @swagger
 * /route-cleaning/session:
 *   post:
 *     summary: Create a new route cleaning session
 *     tags: [Route Cleaning]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Session created
 *       500:
 *         description: Server error
 */
router.post('/session', routeCleaningController.createSession);

/**
 * @swagger
 * /route-cleaning/session/{sessionId}:
 *   get:
 *     summary: Get session information
 *     tags: [Route Cleaning]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session data
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
router.get('/session/:sessionId', routeCleaningController.getSession);

/**
 * @swagger
 * /route-cleaning/session/{sessionId}:
 *   delete:
 *     summary: Clear/delete a session
 *     tags: [Route Cleaning]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session cleared
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
router.delete('/session/:sessionId', routeCleaningController.clearSession);

/**
 * @swagger
 * /route-cleaning/apply:
 *   post:
 *     summary: Apply route mappings to drug table
 *     tags: [Route Cleaning]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *               mappings:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     routeRaw:
 *                       type: string
 *                     newRoute:
 *                       type: string
 *     responses:
 *       200:
 *         description: Mappings applied successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.post('/apply', routeCleaningController.applyRouteMappings);

/**
 * @swagger
 * /route-cleaning/rollback:
 *   post:
 *     summary: Rollback route changes
 *     tags: [Route Cleaning]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Changes rolled back
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.post('/rollback', routeCleaningController.rollbackRouteChanges);

/**
 * @swagger
 * /route-cleaning/stats:
 *   get:
 *     summary: Get route data quality statistics
 *     tags: [Route Cleaning]
 *     responses:
 *       200:
 *         description: Statistics returned
 *       500:
 *         description: Server error
 */
router.get('/stats', routeCleaningController.getRouteStats);

module.exports = router;
