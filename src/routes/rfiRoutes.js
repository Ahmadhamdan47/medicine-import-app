const express = require('express');
const router = express.Router();
const rfiController = require('../controllers/rfiController');

router.put('/edit/:id', rfiController.editRfi); // id is a URL parameter
router.put('/approve/:id', rfiController.approveQuantity);

module.exports = router;