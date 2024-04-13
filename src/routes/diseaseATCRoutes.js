const express = require('express');
const router = express.Router();
const diseaseATCController = require('../controllers/diseaseATCController');

router.post('/', diseaseATCController.addDiseaseCategoryATC);
router.get('/', diseaseATCController.getAllDiseaseCategoryATCs);
router.get('/:id', diseaseATCController.getDiseaseCategoryATCById);
router.put('/:id', diseaseATCController.updateDiseaseCategoryATC);
router.delete('/:id', diseaseATCController.deleteDiseaseCategoryATC);
router.get('/:drugName', diseaseATCController.getDiseaseByDrugName);
router.get('/:diseaseCategoryName', diseaseATCController.getDrugsByDiseaseCategoryName);

module.exports = router;