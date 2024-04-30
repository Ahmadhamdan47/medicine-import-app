const express = require("express");
const router = express.Router();

const cityController = require("../controllers/cityController");

/**
 * @swagger
 * /city/add:
 *   post:
 *     summary: Add a new city
 *     tags: [City]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DistrictId:
 *                 type: integer
 *               Name:
 *                 type: string
 *               NameAr:
 *                 type: string
 *               Enabled:
 *                 type: boolean
 *             example:
 *               DistrictId: 1
 *               Name: "CityName"
 *               NameAr: "ArabicCityName"
 *               Enabled: true
 *     responses:
 *       '200':
 *         description: Successfully added city
 *       '400':
 *         description: Invalid request
 *       '500':
 *         description: Server error
 */
router.post("/add", cityController.addCity);

/**
 * @swagger
 * /city/{CityId}:
 *   get:
 *     summary: Get a city by ID
 *     tags: [City]
 *     parameters:
 *       - in: path
 *         name: CityId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the city to get
 *     responses:
 *       '200':
 *         description: A city object
 *       '500':
 *         description: Internal server error
 */
router.get("/:CityId", cityController.getCityById);

/**
 * @swagger
 * /city:
 *   get:
 *     summary: Get all cities
 *     tags: [City]
 *     responses:
 *       '200':
 *         description: Successfully retrieved cities
 *       '500':
 *         description: Server error
 */
router.get("/", cityController.getAllCities);

/**
 * @swagger
 * /city/{CityId}:
 *   put:
 *     summary: Edit a city
 *     tags: [City]
 *     parameters:
 *       - in: path
 *         name: CityId
 *         required: true
 *         description: ID of the city to edit
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DistrictId:
 *                 type: integer
 *               Name:
 *                 type: string
 *               NameAr:
 *                 type: string
 *               Enabled:
 *                 type: boolean
 *             example:
 *               DistrictId: 1
 *               Name: "UpdatedCityName"
 *               NameAr: "UpdatedArabicCityName"
 *               Enabled: true
 *     responses:
 *       '200':
 *         description: Successfully edited city
 *       '400':
 *         description: Invalid request
 *       '404':
 *         description: City not found
 *       '500':
 *         description: Server error
 */
router.put("/:CityId", cityController.editCity);

/**
 * @swagger
 * /city/{CityId}:
 *   delete:
 *     summary: Delete a city
 *     tags: [City]
 *     parameters:
 *       - in: path
 *         name: CityId
 *         required: true
 *         description: ID of the city to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully deleted city
 *       '404':
 *         description: City not found
 *       '500':
 *         description: Server error
 */
router.delete("/:CityId", cityController.deleteCity);

module.exports = router;
