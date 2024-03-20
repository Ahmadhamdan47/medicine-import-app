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

module.exports = router;
