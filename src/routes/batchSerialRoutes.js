const express = require('express');
const router = express.Router();
const { setInspectionInspected, setInspectionRejected, checkDonationStatusController, getSerialNumberData,fetchSerialNumbersByBoxId } = require('../controllers/batchSerialController');

// Route to update inspection status to 'inspected'
router.put('/inspect/:batchSerialNumberId', setInspectionInspected);

// Route to update inspection status to 'rejected'
router.put('/reject/:batchSerialNumberId', setInspectionRejected);
router.post('/checkDonationStatus', checkDonationStatusController);
router.get('/:serialNumber', getSerialNumberData);
router.get('/byBox/:boxId',fetchSerialNumbersByBoxId);

module.exports = router;