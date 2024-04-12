const express = require('express');
const router = express.Router();
const drugInteractionController = require('../controllers/drugInteractionController');

router.get('/:DrugID', drugInteractionController.getInteractionsByDrugId);
router.post('/', interactionController.addInteraction);
router.put('/:DrugInteractionID', interactionController.editInteraction);
router.delete('/:DrugInteractionID', interactionController.deleteInteraction);
router.get('/:DrugName', interactionController.getInteractionsByDrugName);
module.exports = router;