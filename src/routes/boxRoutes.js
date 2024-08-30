const express = require('express');
const BoxController = require('../controllers/boxController'); // Adjust the path as needed

const router = express.Router();

router.post('/add', BoxController.addBox);
router.delete('/:boxId', BoxController.deleteBox);
router.get('/:donationId', BoxController.getBoxes);
router.put('/:boxId', BoxController.updateBox);

module.exports = router;
