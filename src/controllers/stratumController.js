const { calculatePublicPrice, getStratumInfo, conversionService } = require('../services/stratumService');

exports.getPublicPrice = async (req, res) => {
    const { price, currency, isFOB, rateType } = req.body;

    if (!price || isNaN(price)) {
        return res.status(400).json({ error: 'Invalid price value.' });
    }

    if (!currency) {
        return res.status(400).json({ error: 'Currency is required.' });
    }

    if (typeof isFOB !== 'boolean') {
        return res.status(400).json({ error: 'isFOB must be true or false.' });
    }

    if (!['regular', 'special'].includes(rateType)) {
        return res.status(400).json({ error: 'Invalid rateType. Choose "regular" or "special".' });
    }

    try {
        const result = await calculatePublicPrice({ price: parseFloat(price), currency, isFOB, rateType });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getStratumInfo = async (req, res) => {
    const { stratumCode } = req.params;

    if (!stratumCode) {
        return res.status(400).json({ error: 'stratumCode is required.' });
    }

    try {
        const stratum = await getStratumInfo(stratumCode);
        res.status(200).json(stratum);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
xports.getConversionRate = async (req, res) => {
    const { currency, shippingTerm } = req.query;

    if (!currency) {
        return res.status(400).json({ error: 'Currency is required.' });
    }

    if (!shippingTerm) {
        return res.status(400).json({ error: 'Shipping term is required.' });
    }

    try {
        const conversionRate = await conversionService.getConversionRate(currency, shippingTerm);
        res.status(200).json(conversionRate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.convertToUSD = async (req, res) => {
    const { amount, currency, shippingTerm } = req.body;

    if (!amount || isNaN(amount)) {
        return res.status(400).json({ error: 'Invalid amount value.' });
    }

    if (!currency) {
        return res.status(400).json({ error: 'Currency is required.' });
    }

    if (!shippingTerm) {
        return res.status(400).json({ error: 'Shipping term is required.' });
    }

    try {
        const convertedAmount = await conversionService.convertToUSD(parseFloat(amount), currency, shippingTerm);
        res.status(200).json({ convertedAmount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.convertUSDToLBP = async (req, res) => {
    const { amountUSD, shippingTerm } = req.body;

    if (!amountUSD || isNaN(amountUSD)) {
        return res.status(400).json({ error: 'Invalid USD amount value.' });
    }

    if (!shippingTerm) {
        return res.status(400).json({ error: 'Shipping term is required.' });
    }

    try {
        const convertedAmount = await conversionService.convertUSDToLBP(parseFloat(amountUSD), shippingTerm);
        res.status(200).json({ convertedAmount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};