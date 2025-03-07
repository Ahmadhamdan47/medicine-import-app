// controllers/recipientAgreementController.js
const RecipientAgreementService = require('../services/recipientAgreementsService');

class RecipientAgreementController {
    // Create a new recipient agreement
    static async create(req, res) {
        try {
            const { DonationId, DonorId, RecipientId, Agreed_Upon } = req.body;
            const agreement = await RecipientAgreementService.createRecipientAgreement({
                DonationId,
                DonorId,
                RecipientId,
                Agreed_Upon,
                ExpensesOn
            });
            res.status(201).json({ success: true, data: agreement });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    // Get all recipient agreements
    static async getAll(req, res) {
        try {
            const agreements = await RecipientAgreementService.getAllRecipientAgreements();
            res.status(200).json({ success: true, data: agreements });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Get a single recipient agreement by AgreementId
    static async getById(req, res) {
        try {
            const { agreementId } = req.params;
            const agreement = await RecipientAgreementService.getRecipientAgreementById(agreementId);
            res.status(200).json({ success: true, data: agreement });
        } catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    }

    // Update a recipient agreement
    static async update(req, res) {
        try {
            const { agreementId } = req.params;
            const { DonationId, DonorId, RecipientId, Agreed_Upon } = req.body;
            const updatedAgreement = await RecipientAgreementService.updateRecipientAgreement(agreementId, {
                DonationId,
                DonorId,
                RecipientId,
                Agreed_Upon,
                ExpensesOn
            });
            res.status(200).json({ success: true, data: updatedAgreement });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    // Delete a recipient agreement
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await RecipientAgreementService.deleteRecipientAgreement(id);
            res.status(200).json({ success: true, message: result.message });
        } catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    }
    static async getByRecipientId(req, res) {
        try {
            const { recipientId } = req.params;
            const agreements = await RecipientAgreementService.getByRecipientId(recipientId);
            res.status(200).json({ success: true, data: agreements });
        } catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    }

    // Get all recipient agreements by DonorId
    static async getByDonorId(req, res) {
        try {
            const { donorId } = req.params;
            const agreements = await RecipientAgreementService.getByDonorId(donorId);
            res.status(200).json({ success: true, data: agreements });
        } catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    }
}

module.exports = RecipientAgreementController;