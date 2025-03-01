// services/recipientAgreementService.js
const RecipientAgreement = require('../models/recipientAgreements');

class RecipientAgreementService {
    // Create a new recipient agreement
    static async createRecipientAgreement(data) {
        try {
            const agreement = await RecipientAgreement.create(data);
            return agreement;
        } catch (error) {
            throw new Error(`Error creating recipient agreement: ${error.message}`);
        }
    }

    // Get all recipient agreements
    static async getAllRecipientAgreements() {
        try {
            const agreements = await RecipientAgreement.findAll();
            return agreements;
        } catch (error) {
            throw new Error(`Error fetching recipient agreements: ${error.message}`);
        }
    }

    // Get a single recipient agreement by AgreementId
    static async getRecipientAgreementById(agreementId) {
        try {
            const agreement = await RecipientAgreement.findByPk(agreementId, {
                include: [
                    {
                        model: require('../models/donor'),
                        as: 'donor',
                        attributes: ['DonorName']
                    },
                    {
                        model: require('../models/recipient'),
                        as: 'Recipient',
                        attributes: ['RecipientName']
                    },
                    {
                        model: require('../models/donation'),
                        as: 'donation',
                        attributes: ['DonationId', 'DonationPurpose', 'DonationDate', 'NumberOfBoxes', 'Laboratory', 'LaboratoryCountry']
                    }
                ]
            });
            if (!agreement) {
                throw new Error('Recipient agreement not found');
            }
            return agreement;
        } catch (error) {
            throw new Error(`Error fetching recipient agreement: ${error.message}`);
        }
    }

    // Update a recipient agreement
    static async updateRecipientAgreement(agreementId, data) {
        try {
            const agreement = await RecipientAgreement.findByPk(agreementId);
            if (!agreement) {
                throw new Error('Recipient agreement not found');
            }
            await agreement.update(data);
            return agreement;
        } catch (error) {
            throw new Error(`Error updating recipient agreement: ${error.message}`);
        }
    }
    // Delete a recipient agreement
    static async deleteRecipientAgreement(agreementId) {
        try {
            const agreement = await RecipientAgreement.findByPk(agreementId);
            if (!agreement) {
                throw new Error('Recipient agreement not found');
            }
            await agreement.destroy();
            return { message: 'Recipient agreement deleted successfully' };
        } catch (error) {
            throw new Error(`Error deleting recipient agreement: ${error.message}`);
        }
    }
    static async getByRecipientId(recipientId) {
        try {
            const agreements = await RecipientAgreement.findAll({
                where: { RecipientId: recipientId },
                include: [
                    {
                        model: require('../models/donor'),
                        as: 'donor',
                        attributes: ['DonorName']
                    },
                    {
                        model: require('../models/recipient'),
                        as: 'Recipient',
                        attributes: ['RecipientName']
                    },
                    {
                        model: require('../models/donation'),
                        as: 'donation',
                        attributes: ['DonationId', 'DonationPurpose', 'DonationDate', 'NumberOfBoxes']
                    }
                ]
            });
            if (!agreements || agreements.length === 0) {
                throw new Error('No recipient agreements found for this RecipientId');
            }
            return agreements;
        } catch (error) {
            throw new Error(`Error fetching recipient agreements by RecipientId: ${error.message}`);
        }
    }

    // Get all recipient agreements by DonorId
    static async getByDonorId(donorId) {
        try {
            const agreements = await RecipientAgreement.findAll({
                where: { DonorId: donorId },
                include: [
                    {
                        model: require('../models/donor'),
                        as: 'donor',
                        attributes: ['DonorName']
                    },
                    {
                        model: require('../models/recipient'),
                        as: 'Recipient',
                        attributes: ['RecipientName']
                    },
                    {
                        model: require('../models/donation'),
                        as: 'donation',
                        attributes: ['DonationId', 'DonationPurpose', 'DonationDate', 'NumberOfBoxes']
                    }
                ]
            });
            if (!agreements || agreements.length === 0) {
                throw new Error('No recipient agreements found for this DonorId');
            }
            return agreements;
        } catch (error) {
            throw new Error(`Error fetching recipient agreements by DonorId: ${error.message}`);
        }
    }

}

module.exports = RecipientAgreementService;