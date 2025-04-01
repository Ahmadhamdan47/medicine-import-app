const express = require('express');
const router = express.Router();
const alfaController = require('../controllers/alfaController');

router.get('/', alfaController.getAllAlfaNumbers);
router.post('/', alfaController.addAlfaNumber);
router.put('/setActive/:id', alfaController.setActiveAlfaNumber);

module.exports = router;