const express = require("express");
const router = express.Router();
const donationController = require("../controllers/donationController");
const { authenticateToken } = require("../middlewares/auth");
const { checkDonorPermission, requireDonorAccess } = require("../middlewares/donorPermissions");
const { checkRecipientOwnership } = require("../middlewares/recipientPermissions");

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
router.post("/add", authenticateToken, checkDonorPermission('add_donations'), donationController.addDonation);

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
router.get("/all", authenticateToken, requireDonorAccess, donationController.getAllDonations);
/**
    * @swagger
    * /donation/{id}:
    *   get:
    *     summary: Get donation by ID
    *     description: Retrieve a donation by its ID.
    *     tags: [Donation]
    *     parameters:
    *       - in: path
    *         name: id
    *         required: true
    *         description: The ID of the donation to retrieve.
    *         schema:
    *           type: integer
    *     responses:
    *       '200':
    *         description: OK. Donation retrieved successfully.
    *       '404':
    *         description: Not Found. Donation not found for the specified ID.
    *       '500':
    *         description: Internal Server Error. Failed to retrieve donation.
    */
router.get('/filtered', authenticateToken, requireDonorAccess, donationController.getFilteredDonations);

router.get("/:DonationId", authenticateToken, checkDonorPermission('view_donations'), donationController.getDonationById);

router.put('/:DonationId', authenticateToken, checkDonorPermission('edit_donations'), donationController.editDonation);

router.post('/batchlot', authenticateToken, checkDonorPermission('add_donations'), donationController.createBatchLot);

router.get('/byDonor/:donorId', authenticateToken, checkDonorPermission('view_donations'), donationController.getDonationsByDonor);

router.get('/byRecipient/:recipientId', authenticateToken, checkRecipientOwnership, donationController.getDonationsByRecipient);

module.exports = router;
