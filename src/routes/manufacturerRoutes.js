// src/routes/manufacturerRoutes.js
const express = require("express");
const router = express.Router();
const manufacturerController = require("../controllers/manufacturerController");

/**
 * @swagger
 * /manufacturer/add:
 *   post:
 *     summary: Add a new manufacturer
 *     tags: [Manufacturer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ManufacturerName:
 *                 type: string
 *               Country:
 *                 type: string
 *               Address:
 *                 type: string
 *               PhoneNumber:
 *                 type: string
 *               Email:
 *                 type: string
 *               IsActive:
 *                 type: boolean
 *             example:
 *               ManufacturerName: "Pharma Inc."
 *               Country: "USA"
 *               Address: "123 Pharma St."
 *               PhoneNumber: "123-456-7890"
 *               Email: "contact@pharmainc.com"
 *               IsActive: true
 *     responses:
 *       '200':
 *         description: Successfully added manufacturer
 *       '400':
 *         description: Invalid request
 *       '500':
 *         description: Server error
 */
router.post("/add", manufacturerController.addManufacturer);

/**
 * @swagger
 * /manufacturer/{ManufacturerId}:
 *   get:
 *     summary: Get a manufacturer by ID
 *     tags: [Manufacturer]
 *     parameters:
 *       - in: path
 *         name: ManufacturerId
 *         required: true
 *         description: ID of the manufacturer to get
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: A manufacturer object
 *       '500':
 *         description: Internal server error
 */
router.get("/:ManufacturerId", manufacturerController.getManufacturerById);

/**
 * @swagger
 * /manufacturer:
 *   get:
 *     summary: Get all manufacturers
 *     tags: [Manufacturer]
 *     responses:
 *       '200':
 *         description: Successfully retrieved manufacturers
 *       '500':
 *         description: Server error
 */
router.get("/", manufacturerController.getAllManufacturers);

/**
 * @swagger
 * /manufacturer/{ManufacturerId}:
 *   put:
 *     summary: Edit a manufacturer
 *     tags: [Manufacturer]
 *     parameters:
 *       - in: path
 *         name: ManufacturerId
 *         required: true
 *         description: ID of the manufacturer to edit
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ManufacturerName:
 *                 type: string
 *               Country:
 *                 type: string
 *               Address:
 *                 type: string
 *               PhoneNumber:
 *                 type: string
 *               Email:
 *                 type: string
 *               IsActive:
 *                 type: boolean
 *             example:
 *               ManufacturerName: "Pharma Inc."
 *               Country: "USA"
 *               Address: "123 Pharma St."
 *               PhoneNumber: "123-456-7890"
 *               Email: "contact@pharmainc.com"
 *               IsActive: true
 *     responses:
 *       '200':
 *         description: Successfully edited manufacturer
 *       '400':
 *         description: Invalid request
 *       '500':
 *         description: Server error
 */
router.put("/:ManufacturerId", manufacturerController.editManufacturer);

/**
 * @swagger
 * /manufacturer/{ManufacturerId}:
 *   delete:
 *     summary: Delete a manufacturer
 *     tags: [Manufacturer]
 *     parameters:
 *       - in: path
 *         name: ManufacturerId
 *         required: true
 *         description: ID of the manufacturer to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully deleted manufacturer
 *       '500':
 *         description: Server error
 */
router.delete("/:ManufacturerId", manufacturerController.deleteManufacturer);

module.exports = router;