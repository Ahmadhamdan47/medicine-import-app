const express = require("express");
const router = express.Router();
const donationController = require("../controllers/donationController");

/**
 * @swagger
 * /donation/add:
 *   post:
 *     summary: Add a new donation
 *     description: Add a new donation to the system.
 *     tags: [Donation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DonorId:
 *                 type: integer
 *               RecipientId:
 *                 type: integer
 *               DonationDate:
 *                 type: string
 *                 format: date-time
 *               Quantity:
 *                 type: integer
 *               DonationPurpose:
 *                 type: string
 *               CreatedDate:
 *                 type: string
 *                 format: date-time
 *               UpdatedDate:
 *                 type: string
 *                 format: date-time
 *               Laboratory:
 *                 type: string
 *               LaboratoryCountry:
 *                 type: string
 *     responses:
 *       '200':
 *         description: OK. Donation added successfully.
 *       '500':
 *         description: Internal Server Error. Failed to add donation.
 */
router.post("/add", donationController.addDonation);

/**
 * @swagger
 * /donation/all:
 *   get:
 *     summary: Get all donation
 *     description: Retrieve all donation from the system.
 *     tags: [Donation]
 *     responses:
 *       '200':
 *         description: OK. List of all donation retrieved successfully.
 *       '500':
 *         description: Internal Server Error. Failed to retrieve donation.
 */
router.get("/all", donationController.getAllDonations);

module.exports = router;