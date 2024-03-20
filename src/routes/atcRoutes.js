const express = require("express");
const router = express.Router();
const ATCController = require("../controllers/atcController");

/**
 * @swagger
 * /atc/atc/{drugID}:
 *   get:
 *     summary: Get ATC code by drug ID
 *     description: Retrieve the Anatomical Therapeutic Chemical (ATC) code associated with a drug ID.
 *     tags: [Drug]
 *     parameters:
 *       - in: path
 *         name: drugID
 *         required: true
 *         description: The ID of the drug to retrieve the ATC code for.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: OK. ATC code retrieved successfully.
 *       '404':
 *         description: Not Found. No ATC mapping found for the specified drug ID.
 *       '500':
 *         description: Internal Server Error. Failed to retrieve ATC code.
 */
router.get("/atc/:drugID", ATCController.getATCByDrugID);

module.exports = router;
