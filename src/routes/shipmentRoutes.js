const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');

/**
 * @swagger
 * /shipment/submit/{id}:
 *   put:
 *     summary: Submit Shipment
 *     description: Submit a shipment by its ID.
 *     tags: [Importation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the shipment to submit.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK. Shipment submitted successfully.
 *       '404':
 *         description: Not Found. Shipment not found for the specified ID.
 *       '500':
 *         description: Internal Server Error. Failed to submit shipment.
 */
router.put('/submit/:id', shipmentController.submitShipment);

module.exports = router;
