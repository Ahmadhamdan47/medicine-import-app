const Hospital = require('../models/hospital');

const createHospital = async (data) => {
  return await Hospital.create(data);
};

const getAllHospitals = async () => {
  return await Hospital.findAll();
};

const getHospitalById = async (id) => {
  return await Hospital.findByPk(id);
};

const updateHospital = async (id, data) => {
  const hospital = await Hospital.findByPk(id);
  if (!hospital) return null;
  await hospital.update(data);
  return hospital;
};

const deleteHospital = async (id) => {
  const hospital = await Hospital.findByPk(id);
  if (!hospital) return null;
  await hospital.destroy();
  return true;
};

module.exports = {
  createHospital,
  getAllHospitals,
  getHospitalById,
  updateHospital,
  deleteHospital
};
