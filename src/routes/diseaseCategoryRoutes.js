const express = require('express');
const router = express.Router();
const diseaseCategoryController = require('../controllers/diseaseCategoryController');

/**
 * @swagger
 * /diseaseCategories:
 *   post:
 *     summary: Add a new Disease Categories
 *     tags: [Disease Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CategoryName:
 *                 type: string
 *               CategoryNameAr:
 *                 type: string
 *               CreatedBy:
 *                 type: integer
 *             example:
 *               CategoryName: "Fever"
 *               CategoryNameAr: "حمى"
 *               CreatedBy: 1
 *     responses:
 *       '200':
 *         description: Successfully added Disease Categories
 *       '400':
 *         description: Invalid request
 *       '500':
 *         description: Server error
 */
router.post('/', diseaseCategoryController.addDiseaseCategory);

/**
 * @swagger
 * /diseaseCategories:
 *   get:
 *     summary: Get all disease categories
 *     tags: [Disease Categories]
 *     responses:
 *       '200':
 *         description: Successfully retrieved all disease categories
 *       '500':
 *         description: Server error
 */
router.get('/', diseaseCategoryController.getAllDiseaseCategories);

/**
 * @swagger
 * /diseaseCategories/{id}:
 *   get:
 *     summary: Get a Disease Categories by ID
 *     tags: [Disease Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Disease Categories to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully retrieved Disease Categories
 *       '404':
 *         description: Disease Categories not found
 *       '500':
 *         description: Server error
 */
router.get('/:id', diseaseCategoryController.getDiseaseCategoryById);

/**
 * @swagger
 * /diseaseCategories/{id}:
 *   put:
 *     summary: Update a Disease Categories
 *     tags: [Disease Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Disease Categories to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CategoryName:
 *                 type: string
 *               CategoryNameAr:
 *                 type: string
 *               UpdatedBy:
 *                 type: integer
 *             example:
 *               CategoryName: "Cough"
 *               CategoryNameAr: "سعال"
 *               UpdatedBy: 1
 *     responses:
 *       '200':
 *         description: Successfully updated Disease Categories
 *       '400':
 *         description: Invalid request
 *       '404':
 *         description: Disease Categories not found
 *       '500':
 *         description: Server error
 */
router.put('/:id', diseaseCategoryController.updateDiseaseCategory);

/**
 * @swagger
 * /diseaseCategories/{id}:
 *   delete:
 *     summary: Delete a Disease Categories
 *     tags: [Disease Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Disease Categories to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully deleted Disease Categories
 *       '404':
 *         description: Disease Categories not found
 *       '500':
 *         description: Server error
 */
router.delete('/:id', diseaseCategoryController.deleteDiseaseCategory);

module.exports = router;
