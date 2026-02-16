/**
 * Dosage Cleaning Routes
 * 
 * API endpoints for dosage cleaning operations.
 * 
 * @module dosageCleaningRoutes
 */

const express = require('express');
const router = express.Router();
const dosageCleaningController = require('../controllers/dosageCleaningController');

/**
 * @swagger
 * /dosage-cleaning/forms:
 *   get:
 *     summary: Get unique dosage forms with drug counts
 *     tags: [Dosage Cleaning]
 *     parameters:
 *       - in: query
 *         name: includeNull
 *         schema:
 *           type: boolean
 *         description: Include null/empty Form values
 *     responses:
 *       200:
 *         description: List of unique dosage forms
 *       500:
 *         description: Server error
 */
router.get('/forms', dosageCleaningController.getUniqueDosageForms);

/**
 * @swagger
 * /dosage-cleaning/records:
 *   get:
 *     summary: Get dosage records for cleaning
 *     tags: [Dosage Cleaning]
 *     parameters:
 *       - in: query
 *         name: formFilter
 *         schema:
 *           type: string
 *         description: Filter by drug Form
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum records to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Pagination offset
 *     responses:
 *       200:
 *         description: Dosage records with pagination
 *       500:
 *         description: Server error
 */
router.get('/records', dosageCleaningController.getDosageRecordsForCleaning);

/**
 * @swagger
 * /dosage-cleaning/record/{dosageId}:
 *   put:
 *     summary: Update a single dosage table record
 *     tags: [Dosage Cleaning]
 *     parameters:
 *       - in: path
 *         name: dosageId
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
 *               Numerator1:
 *                 type: number
 *               Numerator1Unit:
 *                 type: string
 *               Denominator1:
 *                 type: number
 *               Denominator1Unit:
 *                 type: string
 *               Numerator2:
 *                 type: number
 *               Numerator2Unit:
 *                 type: string
 *               Denominator2:
 *                 type: number
 *               Denominator2Unit:
 *                 type: string
 *               Numerator3:
 *                 type: number
 *               Numerator3Unit:
 *                 type: string
 *               Denominator3:
 *                 type: number
 *               Denominator3Unit:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dosage record updated
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.put('/record/:dosageId', dosageCleaningController.updateDosageRecord);

/**
 * @swagger
 * /dosage-cleaning/reconstruct/{drugId}:
 *   post:
 *     summary: Reconstruct drug.Dosage field from dosage table
 *     tags: [Dosage Cleaning]
 *     parameters:
 *       - in: path
 *         name: drugId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dosage reconstructed
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.post('/reconstruct/:drugId', dosageCleaningController.reconstructDrugDosage);

/**
 * @swagger
 * /dosage-cleaning/bulk-reconstruct:
 *   post:
 *     summary: Bulk reconstruct dosages for multiple drugs
 *     tags: [Dosage Cleaning]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *               drugIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Bulk reconstruction completed
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.post('/bulk-reconstruct', dosageCleaningController.bulkReconstructDosages);

/**
 * @swagger
 * /dosage-cleaning/preview:
 *   post:
 *     summary: Preview dosage changes before applying
 *     tags: [Dosage Cleaning]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               updates:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     dosageId:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Preview data
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.post('/preview', dosageCleaningController.previewDosageChanges);

/**
 * @swagger
 * /dosage-cleaning/rollback:
 *   post:
 *     summary: Rollback dosage changes
 *     tags: [Dosage Cleaning]
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
router.post('/rollback', dosageCleaningController.rollbackDosageChanges);

/**
 * @swagger
 * /dosage-cleaning/suggest-form:
 *   post:
 *     summary: Suggest dosage form matches from dosageOptions
 *     tags: [Dosage Cleaning]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               form:
 *                 type: string
 *               limit:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Suggestions returned
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.post('/suggest-form', dosageCleaningController.suggestDosageFormMatch);

/**
 * @swagger
 * /dosage-cleaning/stats:
 *   get:
 *     summary: Get dosage data quality statistics
 *     tags: [Dosage Cleaning]
 *     responses:
 *       200:
 *         description: Statistics returned
 *       500:
 *         description: Server error
 */
router.get('/stats', dosageCleaningController.getDosageStats);

/**
 * @swagger
 * /dosage-cleaning/session:
 *   post:
 *     summary: Create a new dosage cleaning session
 *     tags: [Dosage Cleaning]
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
router.post('/session', dosageCleaningController.createSession);

/**
 * @swagger
 * /dosage-cleaning/session/{sessionId}:
 *   get:
 *     summary: Get session information
 *     tags: [Dosage Cleaning]
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
router.get('/session/:sessionId', dosageCleaningController.getSession);

/**
 * @swagger
 * /dosage-cleaning/session/{sessionId}:
 *   delete:
 *     summary: Clear/delete a session
 *     tags: [Dosage Cleaning]
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
router.delete('/session/:sessionId', dosageCleaningController.clearSession);

module.exports = router;
