const Stratum = require('../models/stratum');
const { Op } = require('sequelize');

async function getStratum(price) {
    const stratum = await Stratum.findOne({
        where: { priceThreshold: { [Op.gte]: price } },
        order: [['priceThreshold', 'ASC']]
    });

    if (!stratum) {
        throw new Error('Price does not match any stratum.');
    }

    return stratum;
}

async function calculatePublicPrice({ price, isFOB, rateType }) {
    const stratum = await getStratum(price);

    const dutyRate = rateType === 'regular' ? stratum.regularDutyRate : stratum.specialDutyRate;

    let publicPrice = price * (1 + dutyRate / 100) * 
                            (1 + stratum.agentMargin / 100) * 
                            (1 + stratum.pharmacyMargin / 100);

    if (isFOB) {
        publicPrice *= (1 + stratum.shippingCostRate / 100);
    }

    return {
        stratumCode: stratum.stratumCode,
        publicPrice: publicPrice.toFixed(2)
    };
}

module.exports = { calculatePublicPrice };
