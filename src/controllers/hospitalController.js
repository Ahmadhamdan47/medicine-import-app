
const hospitalService = require('../services/hospitalService');


// CREATE
exports.createHospital = async (req, res) => {
  try {
    const hospital = await hospitalService.createHospital(req.body);
    res.status(201).json(hospital);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL
exports.getAllHospitals = async (req, res) => {
  try {
    const hospitals = await hospitalService.getAllHospitals();
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
exports.getHospitalById = async (req, res) => {
  try {
    const hospital = await hospitalService.getHospitalById(req.params.id);
    if (!hospital) return res.status(404).json({ error: 'Hospital not found' });
    res.json(hospital);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateHospital = async (req, res) => {
  try {
    const hospital = await hospitalService.updateHospital(req.params.id, req.body);
    if (!hospital) return res.status(404).json({ error: 'Hospital not found' });
    res.json(hospital);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.deleteHospital = async (req, res) => {
  try {
    const deleted = await hospitalService.deleteHospital(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Hospital not found' });
    res.json({ message: 'Hospital deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
