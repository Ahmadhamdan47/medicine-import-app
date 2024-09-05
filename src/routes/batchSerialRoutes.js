const express = require('express');
const router = express.Router();
const { setInspectionInspected, setInspectionRejected, checkDonationStatusController } = require('../controllers/batchSerialController');

// Route to update inspection status to 'inspected'
router.put('/inspect/:batchSerialNumberId', setInspectionInspected);

// Route to update inspection status to 'rejected'
router.put('/reject/:batchSerialNumberId', setInspectionRejected);
router.post('/checkDonationStatus', checkDonationStatusController);


module.exports = router;
