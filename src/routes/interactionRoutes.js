const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactionController');

router.get('/:DrugID', interactionController.getInteractionsByDrugId);
router.post('/', interactionController.addInteraction);
router.put('/:DrugInteractionID', interactionController.editInteraction);
router.delete('/:DrugInteractionID', interactionController.deleteInteraction);
router.get('/:DrugName', interactionController.getInteractionsByDrugName);
module.exports = router;