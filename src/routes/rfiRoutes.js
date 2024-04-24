const express = require("express");
const router = express.Router();
const rfiController = require("../controllers/rfiController");

/**
 * @swagger
 * /rfi/edit/{id}:
 *   put:
 *     summary: Edit RFI
 *     description: Edit an RFI by its ID.
 *     tags: [Importation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the RFI to edit.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK. RFI edited successfully.
 *       '404':
 *         description: Not Found. RFI not found for the specified ID.
 *       '500':
 *         description: Internal Server Error. Failed to edit RFI.
 */
router.put("/edit/:id", rfiController.editRfi);

/**
 * @swagger
 * /rfi/approve/{id}:
 *   put:
 *     summary: Approve RFI Quantity
 *     description: Approve the quantity of an RFI by its ID.
 *     tags: [Importation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the RFI to approve quantity for.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK. RFI quantity approved successfully.
 *       '404':
 *         description: Not Found. RFI not found for the specified ID.
 *       '500':
 *         description: Internal Server Error. Failed to approve RFI quantity.
 */
router.put("/approve/:id", rfiController.approveQuantity);

module.exports = router;
