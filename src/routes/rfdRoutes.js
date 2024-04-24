const express = require("express");
const router = express.Router();
const rfdController = require("../controllers/rfdController");

/**
 * @swagger
 * /rfd/{id}/receive:
 *   put:
 *     summary: Receive RFD
 *     description: Receive RFD by its ID.
 *     tags: [Importation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the RFD to receive.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK. RFD received successfully.
 *       '404':
 *         description: Not Found. RFD not found for the specified ID.
 *       '500':
 *         description: Internal Server Error. Failed to receive RFD.
 */
router.put("/:id/receive", rfdController.receiveRFD);

module.exports = router;
