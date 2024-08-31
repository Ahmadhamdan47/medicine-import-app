// src/routes/boxRoutes.js
const express = require('express');
const boxController = require('../controllers/boxController');

const router = express.Router();

// Route to create a new box
router.post('/add', boxController.createBox);

// Route to delete a box
router.delete('/:boxId', boxController.deleteBox);

// Route to get a box by ID
router.get('/:boxId', boxController.getBoxById);

// Route to update a box
router.put('/:boxId', boxController.updateBox);

router.get('/byDonation/:donationId', boxController.getBoxesByDonation);

module.exports = router;
