const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { abuseMiddleware } = require('../middlewares/abuseMiddleware');

router.post('/drug', abuseMiddleware('reportDrug'), reportController.reportDrug);
router.post('/hospital', abuseMiddleware('reportHospital'), reportController.reportHospital);

// Admin/manual abuse endpoints
router.post('/flag', reportController.flagUserAbuse);
router.post('/unblock', reportController.unblockUserAbuse);
router.get('/block-status', reportController.getUserBlockStatus);

module.exports = router;
