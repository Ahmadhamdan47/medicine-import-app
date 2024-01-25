const express = require('express');
const router = express.Router();
const swiftController = require('../controllers/swiftController');

router.put('/submit/:id', swiftController.submitSwift);

module.exports = router;