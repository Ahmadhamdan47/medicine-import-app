const reportService = require('../services/reportService');
const { flagUser, unblockUser, getBlockStatus } = require('../middlewares/abuseMiddleware');

const reportDrug = async (req, res) => {
  try {
    const report = await reportService.reportDrug(req.body);
    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const reportHospital = async (req, res) => {
  try {
    const report = await reportService.reportHospital(req.body);
    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Manual flag/block/unblock endpoints for admin/processing use
const flagUserAbuse = (req, res) => {
  const { uuid, reason } = req.body;
  if (!uuid) return res.status(400).json({ error: 'UUID required' });
  flagUser(uuid, reason);
  res.json({ success: true, message: `User ${uuid} flagged/blocked.`, reason });
};

const unblockUserAbuse = (req, res) => {
  const { uuid } = req.body;
  if (!uuid) return res.status(400).json({ error: 'UUID required' });
  unblockUser(uuid);
  res.json({ success: true, message: `User ${uuid} unblocked.` });
};

const getUserBlockStatus = (req, res) => {
  const { uuid } = req.query;
  if (!uuid) return res.status(400).json({ error: 'UUID required' });
  const status = getBlockStatus(uuid);
  res.json({ uuid, status });
};

module.exports = { reportDrug, reportHospital, flagUserAbuse, unblockUserAbuse, getUserBlockStatus };
