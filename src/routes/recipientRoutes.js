const express = require("express");
const router = express.Router();
const recipientController = require("../controllers/recipientController");

/**
 * @swagger
 * /recipient/add:
 *   post:
 *     summary: Add a new recipient
 *     description: Add a new recipient to the system.
 *     tags: [Donation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               RecipientName:
 *                 type: string
 *               RecipientType:
 *                 type: string
 *               Address:
 *                 type: string
 *               City:
 *                 type: string
 *               Country:
 *                 type: string
 *               ContactPerson:
 *                 type: string
 *               ContactNumber:
 *                 type: string
 *               IsActive:
 *                 type: boolean
 *               CreatedDate:
 *                 type: string
 *                 format: date-time
 *               UpdatedDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       '200':
 *         description: OK. Recipient added successfully.
 *       '500':
 *         description: Internal Server Error. Failed to add recipient.
 */
router.post("/add", recipientController.addRecipient);

/**
 * @swagger
 * /recipient/all:
 *   get:
 *     summary: Get all recipients
 *     description: Retrieve all recipients from the system.
 *     tags: [Donation]
 *     responses:
 *       '200':
 *         description: OK. List of all recipients retrieved successfully.
 *       '500':
 *         description: Internal Server Error. Failed to retrieve recipients.
 */
router.get("/all", recipientController.getAllRecipients);
router.put("/:recipientId", recipientController.editRecipient);
router.delete("/:recipientId", recipientController.deleteRecipient);

module.exports = router;
