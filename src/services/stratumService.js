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

// Conversion Service
const conversionService = {
    async getConversionRate(currency, shippingTerm) {
        const term = this.determineShippingTerm(shippingTerm);
        const conversion = await StratumConversion.findOne({
            where: {
                shipping_term: term,
                currency: currency
            }
        });
        
        if (!conversion) throw new Error(`No conversion rate found for ${currency} (${term})`);
        return conversion;
    },

    async convertToUSD(amount, currency, shippingTerm) {
        const conversion = await this.getConversionRate(currency, shippingTerm);
        return amount * conversion.rate;
    },

    async convertUSDToLBP(amountUSD, shippingTerm) {
        const conversion = await this.getConversionRate('USD', shippingTerm);
        return amountUSD * conversion.lbp_equivalent;
    },

    determineShippingTerm(isFOB) {
        if (isFOB === true) return 'FOB';
        if (isFOB === false) return 'CIF';
        return 'Local';
    }
};

// Updated Price Calculation Service
async function calculatePublicPrice({ price, currency, isFOB, rateType }) {
    // Convert to USD if necessary
    let usdPrice = currency === 'USD' 
        ? price 
        : await conversionService.convertToUSD(price, currency, isFOB);

    // Original calculation logic
    const stratum = await getStratum(usdPrice);
    const dutyRate = rateType === 'regular' 
        ? stratum.regularDutyRate 
        : stratum.specialDutyRate;

    let publicPriceUSD = usdPrice * 
        (1 + dutyRate / 100) *
        (1 + stratum.agentMargin / 100) * 
        (1 + stratum.pharmacyMargin / 100);

    if (isFOB) {
        publicPriceUSD *= (1 + stratum.shippingCostRate / 100);
    }

    // Convert final USD amount to LBP
    const publicPriceLBP = await conversionService.convertUSDToLBP(publicPriceUSD, isFOB);

    return {
        stratumCode: stratum.stratumCode,
        originalCurrency: currency,
        usdAmount: publicPriceUSD.toFixed(2),
        lbpAmount: publicPriceLBP.toFixed(2)
    };
}
async function getStratumInfo(stratumCode) {
    const stratum = await Stratum.findOne({
        where: { stratumCode }
    });

    if (!stratum) {
        throw new Error('Stratum not found.');
    }

    return stratum;
}

module.exports = { calculatePublicPrice,getStratumInfo, conversionService };
