const express = require('express');
const router = express.Router();
const touchController = require('../controllers/touchController');

router.get('/', touchController.getAllTouchNumbers);
router.post('/', touchController.addTouchNumber);
router.put('/setActive/:id', touchController.setActiveTouchNumber);

module.exports = router;