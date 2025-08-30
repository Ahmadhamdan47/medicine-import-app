const { Op } = require('sequelize');
const BankDonation = require('../models/bankDonation');
const EmailService = require('./emailService');

class BankDonationService {
    
    /**
     * Create a new bank donation record and send email to bank
     */
    async createBankDonation(donationData) {
        try {
            // Create the bank donation record
            const bankDonation = await BankDonation.create({
                donor_type: donationData.donor_type,
                account_holder: donationData.account_holder,
                contact_person: donationData.contact_person,
                mobile_number: donationData.mobile_number,
                email_address: donationData.email_address,
                amount: donationData.amount,
                currency: donationData.currency,
                notes: donationData.notes
            });

            // Send email to bank
            await this.sendBankNotificationEmail(bankDonation);

            // Update status and timestamp
            await bankDonation.update({
                status: 'sent_to_bank',
                bank_email_sent_at: new Date()
            });

            return bankDonation;
        } catch (error) {
            throw new Error(`Error creating bank donation: ${error.message}`);
        }
    }

    /**
     * Send notification email to bank with CC to admin
     */
    async sendBankNotificationEmail(bankDonation) {
        try {
            const bankEmail = 'nizarakleh@gmail.com';
            const ccEmail = 'oummalorg@gmail.com';
            
            const subject = `New Money Donation - Reference #${bankDonation.id}`;
            
            const emailBody = `
Dear Bank Team,

We have received a new money donation request with the following details:

DONATION DETAILS:
================
Reference Number: #${bankDonation.id}
Date: ${new Date().toLocaleDateString()}

DONOR INFORMATION:
==================
Donor Type: ${bankDonation.donor_type.charAt(0).toUpperCase() + bankDonation.donor_type.slice(1)}
Account Holder: ${bankDonation.account_holder}
${bankDonation.contact_person ? `Contact Person: ${bankDonation.contact_person}` : ''}
Mobile Number: ${bankDonation.mobile_number}
Email Address: ${bankDonation.email_address}

FINANCIAL DETAILS:
==================
Amount: ${bankDonation.amount} ${bankDonation.currency}
Currency: ${bankDonation.currency}

${bankDonation.notes ? `ADDITIONAL NOTES:
==================
${bankDonation.notes}` : ''}

Please process this donation request and provide us with a bank reference number once completed.

Best regards,
Ommal Medicine Import System
            `.trim();

            // Send email with CC
            await EmailService.sendEmailWithCC(bankEmail, ccEmail, subject, emailBody);
            
        } catch (error) {
            throw new Error(`Error sending bank notification email: ${error.message}`);
        }
    }

    /**
     * Get all bank donations with pagination and filters
     */
    async getAllBankDonations(page = 1, limit = 10, filters = {}) {
        try {
            const offset = (page - 1) * limit;
            const whereClause = {};

            // Apply filters
            if (filters.donor_type) {
                whereClause.donor_type = filters.donor_type;
            }
            if (filters.status) {
                whereClause.status = filters.status;
            }
            if (filters.currency) {
                whereClause.currency = filters.currency;
            }
            if (filters.amount_min) {
                whereClause.amount = {
                    [Op.gte]: filters.amount_min
                };
            }
            if (filters.amount_max) {
                whereClause.amount = {
                    ...whereClause.amount,
                    [Op.lte]: filters.amount_max
                };
            }
            if (filters.date_from) {
                whereClause.created_at = {
                    [Op.gte]: filters.date_from
                };
            }
            if (filters.date_to) {
                whereClause.created_at = {
                    ...whereClause.created_at,
                    [Op.lte]: filters.date_to
                };
            }

            const { count, rows } = await BankDonation.findAndCountAll({
                where: whereClause,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['created_at', 'DESC']]
            });

            return {
                donations: rows,
                totalCount: count,
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit)
            };
        } catch (error) {
            throw new Error(`Error retrieving bank donations: ${error.message}`);
        }
    }

    /**
     * Get bank donation by ID
     */
    async getBankDonationById(id) {
        try {
            const donation = await BankDonation.findByPk(id);
            
            if (!donation) {
                throw new Error('Bank donation not found');
            }

            return donation;
        } catch (error) {
            throw new Error(`Error retrieving bank donation: ${error.message}`);
        }
    }

    /**
     * Update bank donation status (typically after bank confirmation)
     */
    async updateBankDonationStatus(id, status, bankReferenceNumber = null) {
        try {
            const donation = await BankDonation.findByPk(id);
            
            if (!donation) {
                throw new Error('Bank donation not found');
            }

            const updateData = { status };
            if (bankReferenceNumber) {
                updateData.bank_reference_number = bankReferenceNumber;
            }

            await donation.update(updateData);

            return donation;
        } catch (error) {
            throw new Error(`Error updating bank donation status: ${error.message}`);
        }
    }

    /**
     * Get donation statistics
     */
    async getDonationStatistics() {
        try {
            const [totalDonations, pendingCount, confirmedCount, totalAmount] = await Promise.all([
                BankDonation.count(),
                BankDonation.count({ where: { status: 'pending' } }),
                BankDonation.count({ where: { status: 'confirmed' } }),
                BankDonation.sum('amount', { where: { status: 'confirmed' } })
            ]);

            // Get donations by currency
            const donationsByCurrency = await BankDonation.findAll({
                attributes: [
                    'currency',
                    [BankDonation.sequelize.fn('SUM', BankDonation.sequelize.col('amount')), 'total_amount'],
                    [BankDonation.sequelize.fn('COUNT', BankDonation.sequelize.col('id')), 'count']
                ],
                where: { status: 'confirmed' },
                group: ['currency']
            });

            return {
                totalDonations,
                pendingCount,
                confirmedCount,
                totalAmount: totalAmount || 0,
                donationsByCurrency: donationsByCurrency.map(item => ({
                    currency: item.currency,
                    totalAmount: parseFloat(item.dataValues.total_amount),
                    count: parseInt(item.dataValues.count)
                }))
            };
        } catch (error) {
            throw new Error(`Error retrieving donation statistics: ${error.message}`);
        }
    }

    /**
     * Search donations by donor information
     */
    async searchDonations(searchTerm, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;

            const { count, rows } = await BankDonation.findAndCountAll({
                where: {
                    [Op.or]: [
                        { account_holder: { [Op.like]: `%${searchTerm}%` } },
                        { contact_person: { [Op.like]: `%${searchTerm}%` } },
                        { email_address: { [Op.like]: `%${searchTerm}%` } },
                        { mobile_number: { [Op.like]: `%${searchTerm}%` } },
                        { bank_reference_number: { [Op.like]: `%${searchTerm}%` } }
                    ]
                },
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['created_at', 'DESC']]
            });

            return {
                donations: rows,
                totalCount: count,
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit)
            };
        } catch (error) {
            throw new Error(`Error searching donations: ${error.message}`);
        }
    }

    /**
     * Resend bank notification email
     */
    async resendBankNotification(id) {
        try {
            const donation = await this.getBankDonationById(id);
            
            if (donation.status === 'confirmed') {
                throw new Error('Cannot resend notification for confirmed donation');
            }

            await this.sendBankNotificationEmail(donation);
            
            await donation.update({
                bank_email_sent_at: new Date()
            });

            return { message: 'Bank notification email resent successfully' };
        } catch (error) {
            throw new Error(`Error resending bank notification: ${error.message}`);
        }
    }
}

module.exports = new BankDonationService();
