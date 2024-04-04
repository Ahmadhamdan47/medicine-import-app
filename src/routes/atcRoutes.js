const express = require("express");
const router = express.Router();
const ATCController = require("../controllers/atcController");

/**
 * @swagger
 * /atc/{drugID}:
 *   get:
 *     summary: Get ATC code by drug ID
 *     description: Retrieve ATC code associated with a drug ID.
 *     tags: [ATC]
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

/**
 * @swagger
 * /atc/all:
 *   get:
 *     summary: Get all ATC codes
 *     description: Retrieve all ATC Codes.
 *     tags: [ATC]
 *     responses:
 *       '200':
 *         description: OK. All ATC codes retrieved successfully.
 *       '500':
 *         description: Internal Server Error. Failed to retrieve ATC codes.
 */
router.get("/all", ATCController.getAllATCCodes);

/**
 * @swagger
 * /atc/add:
 *   post:
 *     summary: Add ATC codes
 *     description: Add/Post New ATC Code.
 *     tags: [ATC]
 *     parameters:
 *       - in: body
 *         name: ATC_Code
 *         description: The ATC code object to add.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             Code:
 *               type: string
 *             Name:
 *               type: string
 *             Description:
 *               type: string
 *             ParentID:
 *               type: integer
 *     responses:
 *       '200':
 *         description: OK. All ATC code Added successfully.
 *       '500':
 *         description: Internal Server Error. Failed to Add ATC code.
 */
router.post("/add", ATCController.createATCCode);

/**
 * @swagger
 * /atc/{id}:
 *   delete:
 *     summary: Delete ATC code
 *     description: Delete an ATC code by ID.
 *     tags: [ATC]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the ATC code to delete.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: OK. ATC code deleted successfully.
 *       '500':
 *         description: Internal Server Error. Failed to delete ATC code.
 */
router.delete("/atc/:id", ATCController.deleteATCCode);

module.exports = router;
