const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/Donor/register', UserController.donorSignup);
router.post('/Recipient/register', UserController.recipientSignup);

router.get('/Donor/:userId', UserController.getDonorDetails);
router.get('/Recipient/:userId', UserController.getRecipientDetails);
router.get('/donor/username/:username', UserController.getDonorDetailsByUsername);
router.get('/recipient/username/:username', UserController.getRecipientDetailsByUsername);
module.exports = router;
