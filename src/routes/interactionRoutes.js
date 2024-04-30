const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactionController');

/**
 * @swagger
 * /interaction/{DrugID}:
 *   get:
 *     summary: Get interactions by drug ID
 *     tags: [Drug Interaction]
 *     parameters:
 *       - in: path
 *         name: DrugID
 *         required: true
 *         description: ID of the drug to retrieve interactions
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully retrieved interactions
 *       '404':
 *         description: Drug not found
 *       '500':
 *         description: Server error
 */
router.get('/:DrugID', interactionController.getInteractionsByDrugId);

/**
 * @swagger
 * /interaction:
 *   post:
 *     summary: Add a new drug interaction
 *     tags: [Drug Interaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DrugID:
 *                 type: integer
 *               Interaction:
 *                 type: string
 *             example:
 *               DrugID: 1003
 *               Interaction: "Interaction details"
 *     responses:
 *       '200':
 *         description: Successfully added drug interaction
 *       '400':
 *         description: Invalid request
 *       '500':
 *         description: Server error
 */
router.post('/', interactionController.addInteraction);

/**
 * @swagger
 * /interaction/{DrugInteractionID}:
 *   put:
 *     summary: Update a drug interaction
 *     tags: [Drug Interaction]
 *     parameters:
 *       - in: path
 *         name: DrugInteractionID
 *         required: true
 *         description: ID of the drug interaction to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Interaction:
 *                 type: string
 *             example:
 *               Interaction: "Updated interaction details"
 *     responses:
 *       '200':
 *         description: Successfully updated drug interaction
 *       '400':
 *         description: Invalid request
 *       '404':
 *         description: Drug interaction not found
 *       '500':
 *         description: Server error
 */
router.put('/:DrugInteractionID', interactionController.editInteraction);

/**
 * @swagger
 * /interaction/{DrugInteractionID}:
 *   delete:
 *     summary: Delete a drug interaction
 *     tags: [Drug Interaction]
 *     parameters:
 *       - in: path
 *         name: DrugInteractionID
 *         required: true
 *         description: ID of the drug interaction to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully deleted drug interaction
 *       '404':
 *         description: Drug interaction not found
 *       '500':
 *         description: Server error
 */
router.delete('/:DrugInteractionID', interactionController.deleteInteraction);

/**
 * @swagger
 * /interaction/{DrugName}:
 *   get:
 *     summary: Get interactions by drug name
 *     tags: [Drug Interaction]
 *     parameters:
 *       - in: path
 *         name: DrugName
 *         required: true
 *         description: Name of the drug to retrieve interactions
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved interactions
 *       '500':
 *         description: Server error
 */
router.get('/:DrugName', interactionController.getInteractionsByDrugName);

module.exports = router;
