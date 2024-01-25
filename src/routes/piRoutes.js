const express = require('express');
const router = express.Router();
const piController = require('../controllers/piController');

router.put('/submit/:id', piController.submitPI);

module.exports = router;