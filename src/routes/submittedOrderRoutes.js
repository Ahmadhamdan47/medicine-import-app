const express = require('express');
const router = express.Router();
const { submitOrderController } = require('../controllers/submittedOrderController');
const mockDrugSelection = require('../middlewares/mockDrugSelection'); // import the middleware


router.post('/submit',mockDrugSelection, submitOrderController);

module.exports = router;