const express = require('express');
const router = express.Router();
const dosageController = require('../controllers/dosageController');

/**
 * @swagger
 * /dosages:
 *   get:
 *     summary: Get all dosages
 *     responses:
 *       200:
 *         description: A list of dosages.
 */
router.get('/', dosageController.getAllDosages);

/**
 * @swagger
 * /dosages/{id}:
 *   get:
 *     summary: Get a specific dosage by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the dosage.
 *     responses:
 *       200:
 *         description: A dosage object.
 */
router.get('/:id', dosageController.getDosageById);

/**
 * @swagger
 * /dosages:
 *   post:
 *     summary: Create a new dosage
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: The created dosage object.
 */
router.post('/', dosageController.createDosage);

/**
 * @swagger
 * /dosages/{id}:
 *   put:
 *     summary: Update a dosage by ID
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
 *         description: The updated dosage object.
 */
router.put('/:id', dosageController.updateDosage);

/**
 * @swagger
 * /dosages/{id}:
 *   delete:
 *     summary: Delete a dosage by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: A confirmation message.
 */
router.delete('/:id', dosageController.deleteDosage);

/**
 * @swagger
 * /dosages/updateByDrug/{DrugId}:
 *   put:
 *     summary: Update dosages by DrugId
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
 *         description: The updated dosages.
 */
router.put('/updateByDrug/:DrugId', dosageController.updateDosagesByDrugId);

module.exports = router;
