const express = require("express");
const router = express.Router();
const {
  submitOrderController,
} = require("../controllers/submittedOrderController");
const mockDrugSelection = require("../middlewares/mockDrugSelection");

/**
 * @swagger
 * /submittedOrders/submit:
 *   post:
 *     summary: Submit Order
 *     description: Submit an order.
 *     tags: [Importation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               drugId:
 *                 type: string
 *               brandName:
 *                 type: string
 *               quantityRequested:
 *                 type: integer
 *               RFI:
 *                 type: boolean
 *               Result:
 *                 type: boolean
 *               PI:
 *                 type: boolean
 *               swift:
 *                 type: boolean
 *               invoice:
 *                 type: boolean
 *               rfd:
 *                 type: boolean
 *               stock:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: OK. Order submitted successfully.
 *       '500':
 *         description: Internal Server Error. Failed to submit order.
 */
router.post("/submit", mockDrugSelection, submitOrderController);

module.exports = router;
