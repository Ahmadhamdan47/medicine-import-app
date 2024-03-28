const substituteService = require('../services/substituteService'); 



const addSubstitute = async (req, res) => {
    try {
        const { drugId, substituteId } = req.body;
        const substitute = await substituteService.addSubstitute(drugId, substituteId);
        res.json(substitute);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

module.exports = {
    // ...other exports...
    addSubstitute,
};