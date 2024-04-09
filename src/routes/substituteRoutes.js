const express = require('express');
const router = express.Router();
const substituteController = require('../controllers/substituteController');

// ...other routes...

router.post('/addSubstitute', substituteController.addSubstitute);
router.get('/:id', substituteController.getSubstituteById);
router.get('/', substituteController.getAllSubstitutes);
router.put('/:id', substituteController.updateSubstitute);
router.delete('/:id', substituteController.deleteSubstitute);

module.exports = router;