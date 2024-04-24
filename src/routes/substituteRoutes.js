const express = require('express');
const router = express.Router();
const substituteController = require('../controllers/substituteController');

/**
 * @swagger
 * /substitute/addSubstitute:
 *   post:
 *     summary: Add a new substitute
 *     tags: [Substitute]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DrugId:
 *                 type: integer
 *               SubstituteId:
 *                 type: integer
 *             example:
 *               DrugId: 1
 *               SubstituteId: 2
 *     responses:
 *       '200':
 *         description: Successfully added substitute
 *       '400':
 *         description: Invalid request
 *       '500':
 *         description: Server error
 */
router.post('/addSubstitute', substituteController.addSubstitute);

/**
 * @swagger
 * /substitute/{id}:
 *   get:
 *     summary: Get a substitute by ID
 *     tags: [Substitute]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the substitute to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully retrieved substitute
 *       '404':
 *         description: Substitute not found
 *       '500':
 *         description: Server error
 */
router.get('/:id', substituteController.getSubstituteById);

/**
 * @swagger
 * /substitute:
 *   get:
 *     summary: Get all substitutes
 *     tags: [Substitute]
 *     responses:
 *       '200':
 *         description: Successfully retrieved all substitutes
 *       '500':
 *         description: Server error
 */
router.get('/', substituteController.getAllSubstitutes);

/**
 * @swagger
 * /substitute/{id}:
 *   put:
 *     summary: Update a substitute
 *     tags: [Substitute]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the substitute to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DrugId:
 *                 type: integer
 *               SubstituteId:
 *                 type: integer
 *             example:
 *               DrugId: 1
 *               SubstituteId: 3
 *     responses:
 *       '200':
 *         description: Successfully updated substitute
 *       '400':
 *         description: Invalid request
 *       '404':
 *         description: Substitute not found
 *       '500':
 *         description: Server error
 */
router.put('/:id', substituteController.updateSubstitute);

/**
 * @swagger
 * /substitute/{id}:
 *   delete:
 *     summary: Delete a substitute
 *     tags: [Substitute]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the substitute to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully deleted substitute
 *       '404':
 *         description: Substitute not found
 *       '500':
 *         description: Server error
 */
router.delete('/:id', substituteController.deleteSubstitute);

module.exports = router;
