const express = require('express');
const router = express.Router();
const diseaseCategoryController = require('../controllers/diseaseCategoryController');

router.post('/', diseaseCategoryController.addDiseaseCategory);
router.get('/', diseaseCategoryController.getAllDiseaseCategories);
router.get('/:id', diseaseCategoryController.getDiseaseCategoryById);
router.put('/:id', diseaseCategoryController.updateDiseaseCategory);
router.delete('/:id', diseaseCategoryController.deleteDiseaseCategory);

module.exports = router;