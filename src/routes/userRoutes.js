const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/Donor/register', UserController.donorSignup);
router.post('/Recipient/register', UserController.recipientSignup);

module.exports = router;
