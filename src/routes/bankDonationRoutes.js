const express = require('express');
const { body } = require('express-validator');
const BankDonationController = require('../controllers/bankDonationController');
const router = express.Router();

// Validation middleware for creating bank donation
const createBankDonationValidation = [
    body('donor_type')
        .isIn(['personal', 'entity'])
        .withMessage('Donor type must be either "personal" or "entity"'),
    body('account_holder')
        .trim()
        .isLength({ min: 2, max: 255 })
        .withMessage('Account holder name must be between 2 and 255 characters'),
    body('contact_person')
        .optional()
        .trim()
        .isLength({ max: 255 })
        .withMessage('Contact person name must not exceed 255 characters'),
    body('mobile_number')
        .trim()
        .isLength({ min: 8, max: 20 })
        .withMessage('Mobile number must be between 8 and 20 characters')
        .matches(/^[\+\d\s\-\(\)]+$/)
        .withMessage('Mobile number contains invalid characters'),
    body('email_address')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('amount')
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be a positive number greater than 0'),
    body('currency')
        .optional()
        .trim()
        .isLength({ min: 3, max: 3 })
        .withMessage('Currency must be a 3-character code (e.g., USD, LBP)')
        .isAlpha()
        .withMessage('Currency must contain only letters'),
    body('notes')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Notes must not exceed 1000 characters')
];

// Validation for updating status
const updateStatusValidation = [
    body('status')
        .isIn(['pending', 'sent_to_bank', 'confirmed', 'rejected'])
        .withMessage('Status must be one of: pending, sent_to_bank, confirmed, rejected'),
    body('bank_reference_number')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Bank reference number must not exceed 100 characters')
];

/**
 * @swagger
 * components:
 *   schemas:
 *     BankDonation:
 *       type: object
 *       required:
 *         - donor_type
 *         - account_holder
 *         - mobile_number
 *         - email_address
 *         - amount
 *       properties:
 *         donor_type:
 *           type: string
 *           enum: [personal, entity]
 *           description: Type of donor
 *         account_holder:
 *           type: string
 *           description: Name of the account holder
 *         contact_person:
 *           type: string
 *           description: Contact person name (for entities)
 *         mobile_number:
 *           type: string
 *           description: Mobile phone number
 *         email_address:
 *           type: string
 *           format: email
 *           description: Email address of the donor
 *         amount:
 *           type: number
 *           format: decimal
 *           description: Donation amount
 *         currency:
 *           type: string
 *           default: USD
 *           description: Currency code
 *         notes:
 *           type: string
 *           description: Additional notes
 */

/**
 * @swagger
 * /bank-donations:
 *   post:
 *     summary: Create a new bank donation
 *     tags: [Bank Donations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BankDonation'
 *     responses:
 *       201:
 *         description: Bank donation created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/', createBankDonationValidation, BankDonationController.createBankDonation);

/**
 * @swagger
 * /bank-donations:
 *   get:
 *     summary: Get all bank donations with pagination and filters
 *     tags: [Bank Donations]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: donor_type
 *         schema:
 *           type: string
 *           enum: [personal, entity]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, sent_to_bank, confirmed, rejected]
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *       - in: query
 *         name: amount_min
 *         schema:
 *           type: number
 *       - in: query
 *         name: amount_max
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of bank donations
 *       500:
 *         description: Server error
 */
router.get('/', BankDonationController.getAllBankDonations);

/**
 * @swagger
 * /bank-donations/statistics:
 *   get:
 *     summary: Get donation statistics
 *     tags: [Bank Donations]
 *     responses:
 *       200:
 *         description: Donation statistics
 *       500:
 *         description: Server error
 */
router.get('/statistics', BankDonationController.getDonationStatistics);

/**
 * @swagger
 * /bank-donations/search:
 *   get:
 *     summary: Search donations by donor information
 *     tags: [Bank Donations]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Search results
 *       400:
 *         description: Missing search term
 *       500:
 *         description: Server error
 */
router.get('/search', BankDonationController.searchDonations);

/**
 * @swagger
 * /bank-donations/{id}:
 *   get:
 *     summary: Get bank donation by ID
 *     tags: [Bank Donations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bank donation details
 *       404:
 *         description: Bank donation not found
 *       500:
 *         description: Server error
 */
router.get('/:id', BankDonationController.getBankDonationById);

/**
 * @swagger
 * /bank-donations/{id}/status:
 *   put:
 *     summary: Update bank donation status
 *     tags: [Bank Donations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, sent_to_bank, confirmed, rejected]
 *               bank_reference_number:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Bank donation not found
 *       500:
 *         description: Server error
 */
router.put('/:id/status', updateStatusValidation, BankDonationController.updateBankDonationStatus);

/**
 * @swagger
 * /bank-donations/{id}/resend-notification:
 *   post:
 *     summary: Resend bank notification email
 *     tags: [Bank Donations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification resent successfully
 *       400:
 *         description: Cannot resend for confirmed donation
 *       404:
 *         description: Bank donation not found
 *       500:
 *         description: Server error
 */
router.post('/:id/resend-notification', BankDonationController.resendBankNotification);

module.exports = router;
