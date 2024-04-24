const express = require("express");
const router = express.Router();
const diseaseATCController = require("../controllers/diseaseATCController");

/**
 * @swagger
 * /diseaseATC:
 *   post:
 *     summary: Add a new disease category ATC
 *     tags: [Disease ATC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DiseaseCategoryId:
 *                 type: integer
 *               ATC_CodeId:
 *                 type: integer
 *             example:
 *               DiseaseCategoryId: 1
 *               ATC_CodeId: 1
 *     responses:
 *       '200':
 *         description: Successfully added disease category ATC
 *       '400':
 *         description: Invalid request
 *       '500':
 *         description: Server error
 */
router.post("/", diseaseATCController.addDiseaseCategoryATC);

/**
 * @swagger
 * /diseaseATC:
 *   get:
 *     summary: Get all disease category ATCs
 *     tags: [Disease ATC]
 *     responses:
 *       '200':
 *         description: Successfully retrieved all disease category ATCs
 *       '500':
 *         description: Server error
 */
router.get("/", diseaseATCController.getAllDiseaseCategoryATCs);

/**
 * @swagger
 * /diseaseATC/{id}:
 *   get:
 *     summary: Get a disease category ATC by ID
 *     tags: [Disease ATC]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the disease category ATC to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully retrieved disease category ATC
 *       '404':
 *         description: Disease category ATC not found
 *       '500':
 *         description: Server error
 */
router.get("/:id", diseaseATCController.getDiseaseCategoryATCById);

/**
 * @swagger
 * /diseaseATC/{id}:
 *   put:
 *     summary: Update a disease category ATC
 *     tags: [Disease ATC]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the disease category ATC to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DiseaseCategoryId:
 *                 type: integer
 *               ATC_CodeId:
 *                 type: integer
 *             example:
 *               DiseaseCategoryId: 1
 *               ATC_CodeId: 2
 *     responses:
 *       '200':
 *         description: Successfully updated disease category ATC
 *       '400':
 *         description: Invalid request
 *       '404':
 *         description: Disease category ATC not found
 *       '500':
 *         description: Server error
 */
router.put("/:id", diseaseATCController.updateDiseaseCategoryATC);

/**
 * @swagger
 * /diseaseATC/{id}:
 *   delete:
 *     summary: Delete a disease category ATC
 *     tags: [Disease ATC]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the disease category ATC to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully deleted disease category ATC
 *       '404':
 *         description: Disease category ATC not found
 *       '500':
 *         description: Server error
 */
router.delete("/:id", diseaseATCController.deleteDiseaseCategoryATC);

/**
 * @swagger
 * /diseaseATC/{drugName}:
 *   get:
 *     summary: Get diseases by drug name
 *     tags: [Disease ATC]
 *     parameters:
 *       - in: path
 *         name: drugName
 *         required: true
 *         description: Name of the drug
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved diseases by drug name
 *       '500':
 *         description: Server error
 */
router.get("/:drugName", diseaseATCController.getDiseaseByDrugName);

/**
 * @swagger
 * /diseaseATC/{diseaseCategoryName}:
 *   get:
 *     summary: Get drugs by disease category name
 *     tags: [Disease ATC]
 *     parameters:
 *       - in: path
 *         name: diseaseCategoryName
 *         required: true
 *         description: Name of the disease category
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved drugs by disease category name
 *       '500':
 *         description: Server error
 */
router.get("/:diseaseCategoryName", diseaseATCController.getDrugsByDiseaseCategoryName);

module.exports = router;
