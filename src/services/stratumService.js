  const Stratum = require('../models/stratum');
const StratumConversion = require('../models/stratum_conversion'); // Adjust path as needed
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
        if (currency === 'USD') return amount; // No conversion needed for USD
        const conversion = await this.getConversionRate(currency, shippingTerm);
        return amount / conversion.rate; // Convert foreign currency to USD
    },

    async convertUSDToLBP(amountUSD, stratumCode, shippingTerm) {
        const conversion = await this.getConversionRate('USD', shippingTerm);
        
        // Map stratumCode to the correct column in stratum_conversion
        const stratumColumnMap = {
            'E2': 'e2',
            'E1': 'e1',
            'D': 'd',
            'C': 'c',
            'B': 'b',
            'A2': 'a2',
            'A1': 'a1'
        };

        const column = stratumColumnMap[stratumCode];
        if (!column) throw new Error(`Invalid stratumCode: ${stratumCode}`);

        const lbpRate = conversion[column];
        if (!lbpRate) throw new Error(`No LBP rate found for stratum ${stratumCode}`);

        return amountUSD * lbpRate; // Convert USD to LBP using stratum-specific rate
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
    let usdPrice = await conversionService.convertToUSD(price, currency, isFOB);

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

    // Convert final USD amount to LBP using stratum-specific rate
    const publicPriceLBP = await conversionService.convertUSDToLBP(publicPriceUSD, stratum.stratumCode, isFOB);

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
