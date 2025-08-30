const BankDonationService = require('../services/bankDonationService');
const { validationResult } = require('express-validator');

class BankDonationController {

    /**
     * Create a new bank donation
     * POST /api/bank-donations
     */
    async createBankDonation(req, res) {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation errors',
                    errors: errors.array()
                });
            }

            const donationData = {
                donor_type: req.body.donor_type,
                account_holder: req.body.account_holder,
                contact_person: req.body.contact_person,
                mobile_number: req.body.mobile_number,
                email_address: req.body.email_address,
                amount: req.body.amount,
                currency: req.body.currency || 'USD',
                notes: req.body.notes
            };

            const bankDonation = await BankDonationService.createBankDonation(donationData);

            res.status(201).json({
                success: true,
                message: 'Bank donation created successfully and notification sent to bank',
                data: bankDonation
            });

        } catch (error) {
            console.error('Error creating bank donation:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error creating bank donation'
            });
        }
    }

    /**
     * Get all bank donations with pagination and filters
     * GET /api/bank-donations
     */
    async getAllBankDonations(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            
            const filters = {};
            if (req.query.donor_type) filters.donor_type = req.query.donor_type;
            if (req.query.status) filters.status = req.query.status;
            if (req.query.currency) filters.currency = req.query.currency;
            if (req.query.amount_min) filters.amount_min = parseFloat(req.query.amount_min);
            if (req.query.amount_max) filters.amount_max = parseFloat(req.query.amount_max);
            if (req.query.date_from) filters.date_from = req.query.date_from;
            if (req.query.date_to) filters.date_to = req.query.date_to;

            const result = await BankDonationService.getAllBankDonations(page, limit, filters);

            res.status(200).json({
                success: true,
                message: 'Bank donations retrieved successfully',
                data: result
            });

        } catch (error) {
            console.error('Error retrieving bank donations:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error retrieving bank donations'
            });
        }
    }

    /**
     * Get bank donation by ID
     * GET /api/bank-donations/:id
     */
    async getBankDonationById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const donation = await BankDonationService.getBankDonationById(id);

            res.status(200).json({
                success: true,
                message: 'Bank donation retrieved successfully',
                data: donation
            });

        } catch (error) {
            console.error('Error retrieving bank donation:', error);
            const statusCode = error.message.includes('not found') ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || 'Error retrieving bank donation'
            });
        }
    }

    /**
     * Update bank donation status
     * PUT /api/bank-donations/:id/status
     */
    async updateBankDonationStatus(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { status, bank_reference_number } = req.body;

            // Validate status
            const validStatuses = ['pending', 'sent_to_bank', 'confirmed', 'rejected'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ')
                });
            }

            const donation = await BankDonationService.updateBankDonationStatus(
                id, 
                status, 
                bank_reference_number
            );

            res.status(200).json({
                success: true,
                message: 'Bank donation status updated successfully',
                data: donation
            });

        } catch (error) {
            console.error('Error updating bank donation status:', error);
            const statusCode = error.message.includes('not found') ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || 'Error updating bank donation status'
            });
        }
    }

    /**
     * Get donation statistics
     * GET /api/bank-donations/statistics
     */
    async getDonationStatistics(req, res) {
        try {
            const statistics = await BankDonationService.getDonationStatistics();

            res.status(200).json({
                success: true,
                message: 'Donation statistics retrieved successfully',
                data: statistics
            });

        } catch (error) {
            console.error('Error retrieving donation statistics:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error retrieving donation statistics'
            });
        }
    }

    /**
     * Search donations
     * GET /api/bank-donations/search
     */
    async searchDonations(req, res) {
        try {
            const searchTerm = req.query.q;
            if (!searchTerm) {
                return res.status(400).json({
                    success: false,
                    message: 'Search term is required (use ?q=searchterm)'
                });
            }

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const result = await BankDonationService.searchDonations(searchTerm, page, limit);

            res.status(200).json({
                success: true,
                message: 'Search results retrieved successfully',
                data: result
            });

        } catch (error) {
            console.error('Error searching donations:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error searching donations'
            });
        }
    }

    /**
     * Resend bank notification email
     * POST /api/bank-donations/:id/resend-notification
     */
    async resendBankNotification(req, res) {
        try {
            const id = parseInt(req.params.id);
            const result = await BankDonationService.resendBankNotification(id);

            res.status(200).json({
                success: true,
                message: result.message
            });

        } catch (error) {
            console.error('Error resending bank notification:', error);
            const statusCode = error.message.includes('not found') ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                message: error.message || 'Error resending bank notification'
            });
        }
    }
}

module.exports = new BankDonationController();
