const express = require("express");
const router = express.Router();
const donorController = require("../controllers/donorController");

/**
 * @swagger
 * /donor/add:
 *   post:
 *     summary: Add a new donor
 *     description: Add a new donor to the system.
 *     tags: [Donation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DonorName:
 *                 type: string
 *               DonorType:
 *                 type: string
 *                 enum: [Organization, Individual]
 *               Address:
 *                 type: string
 *               PhoneNumber:
 *                 type: string
 *               Email:
 *                 type: string
 *                 format: email
 *               DonorCountry:
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
 *         description: OK. Donor added successfully.
 *       '500':
 *         description: Internal Server Error. Failed to add donor.
 */
router.post("/add", donorController.addDonor);

/**
 * @swagger
 * /donor/all:
 *   get:
 *     summary: Get all donors
 *     description: Retrieve all donors from the system.
 *     tags: [Donation]
 *     responses:
 *       '200':
 *         description: OK. List of all donors retrieved successfully.
 *       '500':
 *         description: Internal Server Error. Failed to retrieve donors.
 */
router.get("/all", donorController.getAllDonors);

router.put("/:donorId", donorController.editDonor);
router.delete("/:donorId", donorController.deleteDonor);

module.exports = router;
