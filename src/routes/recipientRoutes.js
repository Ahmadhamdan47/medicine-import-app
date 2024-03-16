const express = require('express');
const router = express.Router();
const recipientController = require('../controllers/recipientController');

router.post('/add', recipientController.addRecipient);

module.exports = router;