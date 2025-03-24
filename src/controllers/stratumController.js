const { calculatePublicPrice, getStratumInfo } = require('../services/stratumService');

exports.getPublicPrice = async (req, res) => {
    const { price, isFOB, rateType } = req.body;

    if (!price || isNaN(price)) {
        return res.status(400).json({ error: 'Invalid price value.' });
    }

    if (typeof isFOB !== 'boolean') {
        return res.status(400).json({ error: 'isFOB must be true or false.' });
    }

    if (!['regular', 'special'].includes(rateType)) {
        return res.status(400).json({ error: 'Invalid rateType. Choose "regular" or "special".' });
    }

    try {
        const result = await calculatePublicPrice({ price: parseFloat(price), isFOB, rateType });
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