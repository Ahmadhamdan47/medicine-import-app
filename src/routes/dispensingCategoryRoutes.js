const express = require("express");
const router = express.Router();
const dispensingCategoryController = require("../controllers/dispensingCategoryController");

/**
 * @swagger
 * /dispensingCategory:
 *   post:
 *     summary: Add a new dispensing category
 *     tags: [Dispensing Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dispensingCondition:
 *                 type: string
 *             example:
 *               dispensingCondition: "ConditionName"
 *     responses:
 *       '200':
 *         description: Successfully added dispensing category
 *       '400':
 *         description: Invalid request
 *       '500':
 *         description: Server error
 */
router.post("/", dispensingCategoryController.addDispensingCategory);

/**
 * @swagger
 * /dispensingCategory:
 *   get:
 *     summary: Get all dispensing categories
 *     tags: [Dispensing Category]
 *     responses:
 *       '200':
 *         description: Successfully retrieved all dispensing categories
 *       '500':
 *         description: Server error
 */
router.get("/", dispensingCategoryController.getAllDispensingCategories);

/**
 * @swagger
 * /dispensingCategory/{DispensingCategoryId}:
 *   get:
 *     summary: Get a dispensing category by ID
 *     tags: [Dispensing Category]
 *     parameters:
 *       - in: path
 *         name: DispensingCategoryId
 *         required: true
 *         description: ID of the dispensing category to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully retrieved dispensing category
 *       '404':
 *         description: Dispensing category not found
 *       '500':
 *         description: Server error
 */
router.get("/:DispensingCategoryId", dispensingCategoryController.getDispensingCategoryById);

/**
 * @swagger
 * /dispensingCategory/{DispensingCategoryId}:
 *   put:
 *     summary: Update a dispensing category
 *     tags: [Dispensing Category]
 *     parameters:
 *       - in: path
 *         name: DispensingCategoryId
 *         required: true
 *         description: ID of the dispensing category to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dispensingCondition:
 *                 type: string
 *             example:
 *               dispensingCondition: "UpdatedConditionName"
 *     responses:
 *       '200':
 *         description: Successfully updated dispensing category
 *       '400':
 *         description: Invalid request
 *       '404':
 *         description: Dispensing category not found
 *       '500':
 *         description: Server error
 */
router.put("/:DispensingCategoryId", dispensingCategoryController.editDispensingCategory);

/**
 * @swagger
 * /dispensingCategory/{DispensingCategoryId}:
 *   delete:
 *     summary: Delete a dispensing category
 *     tags: [Dispensing Category]
 *     parameters:
 *       - in: path
 *         name: DispensingCategoryId
 *         required: true
 *         description: ID of the dispensing category to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully deleted dispensing category
 *       '404':
 *         description: Dispensing category not found
 *       '500':
 *         description: Server error
 */
router.delete("/:DispensingCategoryId", dispensingCategoryController.deleteDispensingCategory);

module.exports = router;
