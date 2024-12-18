const express = require('express');
const router = express.Router();
const presentationController = require('../controllers/presentationController');

/**
 * @swagger
 * /presentations:
 *   get:
 *     summary: Get all presentations
 *     responses:
 *       200:
 *         description: A list of presentations.
 */
router.get('/', presentationController.getAllPresentations);

/**
 * @swagger
 * /presentations/{id}:
 *   get:
 *     summary: Get a specific presentation by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the presentation.
 *     responses:
 *       200:
 *         description: A presentation object.
 */
router.get('/:id', presentationController.getPresentationById);

/**
 * @swagger
 * /presentations:
 *   post:
 *     summary: Create a new presentation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: The created presentation object.
 */
router.post('/', presentationController.createPresentation);

/**
 * @swagger
 * /presentations/{id}:
 *   put:
 *     summary: Update a presentation by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: The updated presentation object.
 */
router.put('/:id', presentationController.updatePresentation);

/**
 * @swagger
 * /presentations/{id}:
 *   delete:
 *     summary: Delete a presentation by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: A confirmation message.
 */
router.delete('/:id', presentationController.deletePresentation);

/**
 * @swagger
 * /presentations/updateByDrug/{DrugId}:
 *   put:
 *     summary: Update presentations by DrugId
 *     parameters:
 *       - in: path
 *         name: DrugId
 *         required: true
 *         description: Numeric ID of the drug.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: The updated presentations.
 */
router.put('/updateByDrug/:DrugId', presentationController.updatePresentationsByDrugId);


module.exports = router;
