// src/routes/responsiblePartyRoutes.js
const express = require("express");
const router = express.Router();
const responsiblePartyController = require("../controllers/responsiblePartyController");

/**
 * @swagger
 * /responsibleParty/add:
 *   post:
 *     summary: Add a new responsible party
 *     tags: [ResponsibleParty]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ResponsiblePartyName:
 *                 type: string
 *               Country:
 *                 type: string
 *             example:
 *               ResponsiblePartyName: "John Doe"
 *               Country: "USA"
 *     responses:
 *       '200':
 *         description: Successfully added responsible party
 *       '400':
 *         description: Invalid request
 *       '500':
 *         description: Server error
 */
router.post("/add", responsiblePartyController.addResponsibleParty);

/**
 * @swagger
 * /responsibleParty/{ResponsiblePartyId}:
 *   get:
 *     summary: Get a responsible party by ID
 *     tags: [ResponsibleParty]
 *     parameters:
 *       - in: path
 *         name: ResponsiblePartyId
 *         required: true
 *         description: ID of the responsible party to get
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: A responsible party object
 *       '500':
 *         description: Internal server error
 */
router.get("/:ResponsiblePartyId", responsiblePartyController.getResponsiblePartyById);

/**
 * @swagger
 * /responsibleParty:
 *   get:
 *     summary: Get all responsible parties
 *     tags: [ResponsibleParty]
 *     responses:
 *       '200':
 *         description: Successfully retrieved responsible parties
 *       '500':
 *         description: Server error
 */
router.get("/all", responsiblePartyController.getAllResponsibleParties);

/**
 * @swagger
 * /responsibleParty/{ResponsiblePartyId}:
 *   put:
 *     summary: Edit a responsible party
 *     tags: [ResponsibleParty]
 *     parameters:
 *       - in: path
 *         name: ResponsiblePartyId
 *         required: true
 *         description: ID of the responsible party to edit
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ResponsiblePartyName:
 *                 type: string
 *               Country:
 *                 type: string
 *             example:
 *               ResponsiblePartyName: "John Doe"
 *               Country: "USA"
 *     responses:
 *       '200':
 *         description: Successfully edited responsible party
 *       '400':
 *         description: Invalid request
 *       '500':
 *         description: Server error
 */
router.put("/:ResponsiblePartyId", responsiblePartyController.editResponsibleParty);

/**
 * @swagger
 * /responsibleParty/{ResponsiblePartyId}:
 *   delete:
 *     summary: Delete a responsible party
 *     tags: [ResponsibleParty]
 *     parameters:
 *       - in: path
 *         name: ResponsiblePartyId
 *         required: true
 *         description: ID of the responsible party to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully deleted responsible party
 *       '500':
 *         description: Server error
 */
router.delete("/:ResponsiblePartyId", responsiblePartyController.deleteResponsibleParty);

module.exports = router;