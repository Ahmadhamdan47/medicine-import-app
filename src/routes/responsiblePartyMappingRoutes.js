// src/routes/responsiblePartyMappingRoutes.js
const express = require("express");
const router = express.Router();
const responsiblePartyMappingController = require("../controllers/responsiblePartyMappingController");

/**
 * @swagger
 * /responsibleParty-mapping:
 *   get:
 *     summary: Get mapping of responsible parties to their countries from drug table
 *     description: Returns a list of unique responsible parties with their associated countries based on actual drug data
 *     tags: [ResponsiblePartyMapping]
 *     responses:
 *       '200':
 *         description: Successfully retrieved responsible party-country mappings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       responsibleParty:
 *                         type: string
 *                       countries:
 *                         type: array
 *                         items:
 *                           type: string
 *                       primaryCountry:
 *                         type: string
 *       '500':
 *         description: Server error
 */
router.get("/", responsiblePartyMappingController.getResponsiblePartyCountryMapping);

/**
 * @swagger
 * /responsibleParty-mapping/stats:
 *   get:
 *     summary: Get statistics for responsible party-country combinations
 *     description: Returns the count of drugs for each responsible party-country combination
 *     tags: [ResponsiblePartyMapping]
 *     responses:
 *       '200':
 *         description: Successfully retrieved statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ResponsibleParty:
 *                         type: string
 *                       ResponsiblePartyCountry:
 *                         type: string
 *                       drugCount:
 *                         type: integer
 *       '500':
 *         description: Server error
 */
router.get("/stats", responsiblePartyMappingController.getResponsiblePartyCountryStats);

/**
 * @swagger
 * /responsibleParty-mapping/{responsiblePartyName}/countries:
 *   get:
 *     summary: Get all countries for a specific responsible party
 *     description: Returns all countries associated with a given responsible party, along with drug counts
 *     tags: [ResponsiblePartyMapping]
 *     parameters:
 *       - in: path
 *         name: responsiblePartyName
 *         required: true
 *         description: Name of the responsible party
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved countries for the responsible party
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 responsibleParty:
 *                   type: string
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ResponsiblePartyCountry:
 *                         type: string
 *                       drugCount:
 *                         type: integer
 *       '500':
 *         description: Server error
 */
router.get("/:responsiblePartyName/countries", responsiblePartyMappingController.getCountriesForResponsibleParty);

module.exports = router;
