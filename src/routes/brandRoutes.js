const express = require("express");
const router = express.Router();
const brandController = require("../controllers/brandController");

/**
 * @swagger
 * /brand/add:
 *   post:
 *     summary: Add a new brand
 *     tags: [Brand]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               BrandName:
 *                 type: string
 *             example:
 *               BrandName: Panadol
 *     responses:
 *       '200':
 *         description: Successfully added brand
 *       '400':
 *         description: Invalid request
 *       '500':
 *         description: Server error
 */
router.post("/add", brandController.addBrand);

/**
 * @swagger
 * /brand/{BrandId}:
 *   get:
 *     summary: Get a brand by ID
 *     tags: [Brand]
 *     parameters:
 *       - in: path
 *         name: BrandId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the brand to get
 *     responses:
 *       '200':
 *         description: A brand object
 *       '500':
 *         description: Internal server error
 */

router.get("/:BrandId", brandController.getBrandById);

/**
 * @swagger
 * /brand:
 *   get:
 *     summary: Get all brands
 *     tags: [Brand]
 *     responses:
 *       '200':
 *         description: Successfully retrieved brands
 *       '500':
 *         description: Server error
 */
router.get("/", brandController.getAllBrands);

/**
 * @swagger
 * /brand/{BrandId}:
 *   put:
 *     summary: Edit a brand
 *     tags: [Brand]
 *     parameters:
 *       - in: path
 *         name: BrandId
 *         required: true
 *         description: ID of the brand to edit
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               BrandName:
 *                 type: string
 *             example:
 *               BrandName: Adidas
 *     responses:
 *       '200':
 *         description: Successfully edited brand
 *       '400':
 *         description: Invalid request
 *       '404':
 *         description: Brand not found
 *       '500':
 *         description: Server error
 */
router.put("/:BrandId", brandController.editBrand);

/**
 * @swagger
 * /brands/{BrandId}:
 *   delete:
 *     summary: Delete a brand
 *     tags: [Brand]
 *     parameters:
 *       - in: path
 *         name: BrandId
 *         required: true
 *         description: ID of the brand to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully deleted brand
 *       '404':
 *         description: Brand not found
 *       '500':
 *         description: Server error
 */
router.delete("/:BrandId", brandController.deleteBrand);

module.exports = router;
