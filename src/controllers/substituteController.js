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


const getSubstituteById = async (req, res) => {
    try {
        const substitute = await substituteService.getSubstituteById(req.params.id);
        res.json(substitute);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getAllSubstitutes = async (req, res) => {
    try {
        const substitutes = await substituteService.getAllSubstitutes();
        res.json(substitutes);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const updateSubstitute = async (req, res) => {
    try {
        const { drugId, substituteId } = req.body;
        const substitute = await substituteService.updateSubstitute(req.params.id, drugId, substituteId);
        res.json(substitute);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const deleteSubstitute = async (req, res) => {
    try {
        await substituteService.deleteSubstitute(req.params.id);
        res.json({ message: 'Substitute deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

module.exports = {
    addSubstitute,
    getSubstituteById,
    getAllSubstitutes,
    updateSubstitute,
    deleteSubstitute,
};