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

/**
 * @swagger
 * /donor/{DonorId}:
 *   put:
 *     summary: Edit donor details
 *     description: Edit the details of an existing donor by DonorId.
 *     tags: [Donation]
 *     parameters:
 *       - in: path
 *         name: DonorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the donor to edit.
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
 *     responses:
 *       '200':
 *         description: OK. Donor details updated successfully.
 *       '404':
 *         description: Not Found. Donor not found.
 *       '500':
 *         description: Internal Server Error. Failed to update donor.
 */
router.put("/:DonorId", donorController.editDonor);

/**
 * @swagger
 * /donor/{donorId}:
 *   delete:
 *     summary: Delete a donor
 *     description: Delete a donor from the system by donorId.
 *     tags: [Donation]
 *     parameters:
 *       - in: path
 *         name: donorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the donor to delete.
 *     responses:
 *       '200':
 *         description: OK. Donor deleted successfully.
 *       '404':
 *         description: Not Found. Donor not found.
 *       '500':
 *         description: Internal Server Error. Failed to delete donor.
 */
router.delete("/:donorId", donorController.deleteDonor);

/**
 * @swagger
 * /donor/byUsername/{username}:
 *   get:
 *     summary: Get donor by username
 *     description: Retrieve donor information by username.
 *     tags: [Donation]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the donor.
 *     responses:
 *       '200':
 *         description: OK. Donor information retrieved successfully.
 *       '404':
 *         description: Not Found. Donor not found.
 *       '500':
 *         description: Internal Server Error. Failed to retrieve donor.
 */
router.get('/byUsername/:username', donorController.getDonorByUsername);

/**
 * @swagger
 * /donor/isActive/{donorId}:
 *   get:
 *     summary: Get donor active status
 *     description: Retrieve the active status of a donor by donorId.
 *     tags: [Donation]
 *     parameters:
 *       - in: path
 *         name: donorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the donor.
 *     responses:
 *       '200':
 *         description: OK. Donor status retrieved successfully.
 *       '404':
 *         description: Not Found. Donor not found.
 *       '500':
 *         description: Internal Server Error. Failed to retrieve donor status.
 */
router.get('/isActive/:donorId', donorController.getIsActiveStatus);

module.exports = router;
