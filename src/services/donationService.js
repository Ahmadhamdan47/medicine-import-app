// src/services/donationService.js
const Donation = require('../models/donation');
const Donor = require('../models/Donor');
const Recipient = require('../models/recipient');
const Drug = require('../models/Drug');
const BatchLotTracking = require('../models/BatchLot');

const createDonation = async (donationData) => {
    try {
        const { donorName, recipientName, drugName, GTIN, LOT, ProductionDate, ExpiryDate, quantity, donationPurpose, Laboratory, LaboratoryCountry } = donationData;

        // Fetch donor and recipient by their names
        const donor = await Donor.findOne({ where: { name: donorName } });
        const recipient = await Recipient.findOne({ where: { name: recipientName } });

        // Fetch drug by its name and GTIN
        const drug = await Drug.findOne({ where: { name: drugName, GTIN: GTIN } });

        if (!donor || !recipient || !drug) {
            throw new Error('Donor, recipient or drug not found');
        }

    // Check if the LaboratoryCountry or the donor's country is 'Israel'
    if (LaboratoryCountry === 'Israel' || donor.country === 'Israel') {
        throw new Error('This drug is not acceptable');
      }

        // Create a new donation
        const donation = await Donation.create({
            DonorId: donor.id,
            RecipientId: recipient.id,
            Quantity: quantity,
            DonationPurpose: donationPurpose,
            Laboratory: Laboratory,
            LaboratoryCountry: LaboratoryCountry
        });

        // Add a row in the BatchLotTracking table
        await BatchLotTracking.create({
            DrugId: drug.id,
            BatchNumber: LOT,
            ProductionDate: ProductionDate,
            ExpiryDate: ExpiryDate,
            Quantity: quantity
        });

        return donation;
    } catch (error) {
        throw new Error('Error in donationService: ' + error.message);
    }
};



const getDonationById = async (id) => {
    try {
        const donation = await Donation.findByPk(id);
        return donation;
    } catch (error) {
        throw new Error('Error in donationService: ' + error.message);
    }
};

const updateDonation = async (id, updatedData) => {
    try {
        const donation = await Donation.update(updatedData, {
            where: {
                id: id
            }
        });
        return donation;
    } catch (error) {
        throw new Error('Error in donationService: ' + error.message);
    }
};

const deleteDonation = async (id) => {
    try {
        const donation = await Donation.destroy({
            where: {
                id: id
            }
        });
        return donation;
    } catch (error) {
        throw new Error('Error in donationService: ' + error.message);
    }
};

module.exports = {
    createDonation,
    getDonationById,
    updateDonation,
    deleteDonation
};