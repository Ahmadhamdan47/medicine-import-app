const DrugReport = require('../models/drugReport');
const HospitalReport = require('../models/hospitalReport');
const abuseService = require('./abuseService');

async function reportDrug({
  GTIN, BatchNumber, SerialNumber, ExpiryDate,
  drugNameByGTIN, userDrugName, description, photo, uuid,
  username, email, password
}) {
  // Abuse prevention: block/limit by uuid
  if (abuseService.isBlocked(uuid)) {
    throw new Error('User is temporarily blocked due to abuse or excessive usage.');
  }
  if (!abuseService.checkRateLimit(uuid, 'reportDrug')) {
    throw new Error('Rate limit exceeded. User is temporarily blocked.');
  }
  return await DrugReport.create({
    GTIN, BatchNumber, SerialNumber, ExpiryDate,
    drugNameByGTIN, userDrugName, description, photo, uuid,
    username, email, password
  });
}

async function reportHospital({
  hospitalName, hospitalInfo, description, photo, uuid,
  username, email, password
}) {
  // Abuse prevention: block/limit by uuid
  if (abuseService.isBlocked(uuid)) {
    throw new Error('User is temporarily blocked due to abuse or excessive usage.');
  }
  if (!abuseService.checkRateLimit(uuid, 'reportHospital')) {
    throw new Error('Rate limit exceeded. User is temporarily blocked.');
  }
  return await HospitalReport.create({
    hospitalName, hospitalInfo, description, photo, uuid,
    username, email, password
  });
}

// API for manual flag/block/unblock (to be used in controller)
// abuseService.flagUser(uuid, reason)
// abuseService.unblockUser(uuid)
// abuseService.getBlockStatus(uuid)

module.exports = { reportDrug, reportHospital };
