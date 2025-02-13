const express = require("express");
const router = express.Router();
const recipientAgreementController = require("../controllers/recipientAgreementsController");

/**
 * @swagger
 * /recipient-agreements/add:
 *   post:
 *     summary: Add a new recipient agreement
 *     description: Add a new recipient agreement to the system.
 *     tags: [Recipient Agreements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DonationId:
 *                 type: integer
 *               DonorId:
 *                 type: integer
 *               RecipientId:
 *                 type: integer
 *               Agreed_Upon:
 *                 type: string
 *                 enum: [agreed, pending, refused]
 *     responses:
 *       '201':
 *         description: Created. Recipient agreement added successfully.
 *       '400':
 *         description: Bad Request. Invalid input data.
 */
router.post("/add", recipientAgreementController.create);

/**
 * @swagger
 * /recipient-agreements/all:
 *   get:
 *     summary: Get all recipient agreements
 *     description: Retrieve all recipient agreements from the system.
 *     tags: [Recipient Agreements]
 *     responses:
 *       '200':
 *         description: OK. List of all recipient agreements retrieved successfully.
 *       '500':
 *         description: Internal Server Error. Failed to retrieve recipient agreements.
 */
router.get("/all", recipientAgreementController.getAll);

/**
 * @swagger
 * /recipient-agreements/{agreementId}:
 *   get:
 *     summary: Get a recipient agreement by ID
 *     description: Retrieve a single recipient agreement by its AgreementId.
 *     tags: [Recipient Agreements]
 *     parameters:
 *       - in: path
 *         name: agreementId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the recipient agreement to retrieve.
 *     responses:
 *       '200':
 *         description: OK. Recipient agreement retrieved successfully.
 *       '404':
 *         description: Not Found. Recipient agreement not found.
 */
router.get("/:agreementId", recipientAgreementController.getById);

/**
 * @swagger
 * /recipient-agreements/{agreementId}:
 *   put:
 *     summary: Update a recipient agreement
 *     description: Update an existing recipient agreement by its AgreementId.
 *     tags: [Recipient Agreements]
 *     parameters:
 *       - in: path
 *         name: agreementId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the recipient agreement to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DonationId:
 *                 type: integer
 *               DonorId:
 *                 type: integer
 *               RecipientId:
 *                 type: integer
 *               Agreed_Upon:
 *                 type: string
 *                 enum: [agreed, pending, refused]
 *     responses:
 *       '200':
 *         description: OK. Recipient agreement updated successfully.
 *       '400':
 *         description: Bad Request. Invalid input data.
 *       '404':
 *         description: Not Found. Recipient agreement not found.
 */
router.put("/:agreementId", recipientAgreementController.update);

/**
 * @swagger
 * /recipient-agreements/{agreementId}:
 *   delete:
 *     summary: Delete a recipient agreement
 *     description: Delete an existing recipient agreement by its AgreementId.
 *     tags: [Recipient Agreements]
 *     parameters:
 *       - in: path
 *         name: agreementId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the recipient agreement to delete.
 *     responses:
 *       '200':
 *         description: OK. Recipient agreement deleted successfully.
 *       '404':
 *         description: Not Found. Recipient agreement not found.
 */
router.delete("/:agreementId", recipientAgreementController.delete);
/**
 * @swagger
 * /recipient-agreements/recipient/{recipientId}:
 *   get:
 *     summary: Get recipient agreements by RecipientId
 *     description: Retrieve all recipient agreements for a specific RecipientId.
 *     tags: [Recipient Agreements]
 *     parameters:
 *       - in: path
 *         name: recipientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the recipient to retrieve agreements for.
 *     responses:
 *       '200':
 *         description: OK. List of recipient agreements retrieved successfully.
 *       '404':
 *         description: Not Found. No recipient agreements found for this RecipientId.
 */
router.get("/recipient/:recipientId", recipientAgreementController.getByRecipientId);

/**
 * @swagger
 * /recipient-agreements/donor/{donorId}:
 *   get:
 *     summary: Get recipient agreements by DonorId
 *     description: Retrieve all recipient agreements for a specific DonorId.
 *     tags: [Recipient Agreements]
 *     parameters:
 *       - in: path
 *         name: donorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the donor to retrieve agreements for.
 *     responses:
 *       '200':
 *         description: OK. List of recipient agreements retrieved successfully.
 *       '404':
 *         description: Not Found. No recipient agreements found for this DonorId.
 */
router.get("/donor/:donorId", recipientAgreementController.getByDonorId);

module.exports = router;