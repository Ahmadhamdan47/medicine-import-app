/**
 * Form Cleaning Routes
 * 
 * API endpoints for form cleaning operations.
 * 
 * @module formCleaningRoutes
 */

const express = require('express');
const router = express.Router();
const formCleaningController = require('../controllers/formCleaningController');

/**
 * @swagger
 * /form-cleaning/unique-values:
 *   get:
 *     summary: Get unique FormRaw values with drug counts
 *     tags: [Form Cleaning]
 *     parameters:
 *       - in: query
 *         name: includeNull
 *         schema:
 *           type: boolean
 *         description: Include null/empty FormRaw values
 *       - in: query
 *         name: minCount
 *         schema:
 *           type: integer
 *         description: Minimum drug count to include
 *     responses:
 *       200:
 *         description: List of unique FormRaw values
 *       500:
 *         description: Server error
 */
router.get('/unique-values', formCleaningController.getUniqueFormRaw);

/**
 * @swagger
 * /form-cleaning/suggest-matches:
 *   post:
 *     summary: Suggest form matches for a FormRaw value
 *     tags: [Form Cleaning]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               formRaw:
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
router.post('/suggest-matches', formCleaningController.suggestFormMatch);

/**
 * @swagger
 * /form-cleaning/affected-drugs:
 *   get:
 *     summary: Get drugs affected by a FormRaw value
 *     tags: [Form Cleaning]
 *     parameters:
 *       - in: query
 *         name: formRaw
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
 *         description: FormRaw parameter missing
 *       500:
 *         description: Server error
 */
router.get('/affected-drugs', formCleaningController.getAffectedDrugs);

/**
 * @swagger
 * /form-cleaning/preview:
 *   post:
 *     summary: Preview form mappings before applying
 *     tags: [Form Cleaning]
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
 *                     formRaw:
 *                       type: string
 *                     newForm:
 *                       type: string
 *     responses:
 *       200:
 *         description: Preview data
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.post('/preview', formCleaningController.previewFormMapping);

/**
 * @swagger
 * /form-cleaning/session:
 *   post:
 *     summary: Create a new form cleaning session
 *     tags: [Form Cleaning]
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
router.post('/session', formCleaningController.createSession);

/**
 * @swagger
 * /form-cleaning/session/{sessionId}:
 *   get:
 *     summary: Get session information
 *     tags: [Form Cleaning]
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
router.get('/session/:sessionId', formCleaningController.getSession);

/**
 * @swagger
 * /form-cleaning/session/{sessionId}:
 *   delete:
 *     summary: Clear/delete a session
 *     tags: [Form Cleaning]
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
router.delete('/session/:sessionId', formCleaningController.clearSession);

/**
 * @swagger
 * /form-cleaning/apply:
 *   post:
 *     summary: Apply form mappings to drug table
 *     tags: [Form Cleaning]
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
 *                     formRaw:
 *                       type: string
 *                     newForm:
 *                       type: string
 *     responses:
 *       200:
 *         description: Mappings applied successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.post('/apply', formCleaningController.applyFormMappings);

/**
 * @swagger
 * /form-cleaning/rollback:
 *   post:
 *     summary: Rollback form changes
 *     tags: [Form Cleaning]
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
router.post('/rollback', formCleaningController.rollbackFormChanges);

/**
 * @swagger
 * /form-cleaning/stats:
 *   get:
 *     summary: Get form data quality statistics
 *     tags: [Form Cleaning]
 *     responses:
 *       200:
 *         description: Statistics returned
 *       500:
 *         description: Server error
 */
router.get('/stats', formCleaningController.getFormStats);

module.exports = router;
