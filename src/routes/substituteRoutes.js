const express = require('express');
const router = express.Router();
const substituteController = require('../controllers/substituteController');

// ...other routes...

router.post('/addSubstitute', substituteController.addSubstitute);

module.exports = router;