const AlfaNumbers = require('../models/alfaNumbers');
const TouchNumbers = require('../models/touchNumbers');

const getMobileDonationStatus = async () => {
    // You can replace this with a DB config or ENV variable if needed
    const isMobileDonationOn = true; // Hardcoded for now

    // Get active Alfa number
    const alfa = await AlfaNumbers.findOne({ where: { isActive: true } });
    // Get active Touch number
    const touch = await TouchNumbers.findOne({ where: { isActive: true } });

    return {
        isMobileDonationOn,
        alfaNumber: alfa ? alfa.phoneNumber : null,
        touchNumber: touch ? touch.phoneNumber : null
    };
};

module.exports = { getMobileDonationStatus };
