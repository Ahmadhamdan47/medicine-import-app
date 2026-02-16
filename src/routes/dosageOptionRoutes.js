const express = require("express");
const router = express.Router();

const dosageOptionController = require("../controllers/dosageOptionController");

/**
 * @swagger
 * /dosageOptions/add:
 *   post:
 *     summary: Add a new dosage option
 *     tags: [Dosage Options]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DosageFormClean:
 *                 type: string
 *               PhysicalState:
 *                 type: string
 *               SubstitutionRelationship:
 *                 type: string
 *               CreatedBy:
 *                 type: integer
 *             example:
 *               DosageFormClean: "Tablet"
 *               PhysicalState: "Solid"
 *               SubstitutionRelationship: "S1S2S7"
 *               CreatedBy: 1
 *     responses:
 *       '200':
 *         description: Successfully added dosage option
 *       '400':
 *         description: Invalid request
 *       '500':
 *         description: Server error
 *
 * /dosageOptions:
 *   get:
 *     summary: Get all dosage options
 *     tags: [Dosage Options]
 *     responses:
 *       '200':
 *         description: Successfully retrieved all dosage options
 *       '500':
 *         description: Server error
 *
 * /dosageOptions/search:
 *   get:
 *     summary: Search dosage options
 *     tags: [Dosage Options]
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         description: Search term for dosage form, physical state, or substitution relationship
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved matching dosage options
 *       '400':
 *         description: Search term is required
 *       '500':
 *         description: Server error
 *
 * /dosageOptions/{DosageOptionId}:
 *   get:
 *     summary: Get a dosage option by ID
 *     tags: [Dosage Options]
 *     parameters:
 *       - in: path
 *         name: DosageOptionId
 *         required: true
 *         description: ID of the dosage option to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully retrieved dosage option
 *       '404':
 *         description: Dosage option not found
 *       '500':
 *         description: Server error
 *   put:
 *     summary: Update a dosage option
 *     tags: [Dosage Options]
 *     parameters:
 *       - in: path
 *         name: DosageOptionId
 *         required: true
 *         description: ID of the dosage option to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DosageFormClean:
 *                 type: string
 *               PhysicalState:
 *                 type: string
 *               SubstitutionRelationship:
 *                 type: string
 *               UpdatedBy:
 *                 type: integer
 *             example:
 *               DosageFormClean: "Tablet, coated"
 *               UpdatedBy: 1
 *     responses:
 *       '200':
 *         description: Successfully updated dosage option
 *       '400':
 *         description: Invalid request
 *       '404':
 *         description: Dosage option not found
 *       '500':
 *         description: Server error
 *   delete:
 *     summary: Delete a dosage option
 *     tags: [Dosage Options]
 *     parameters:
 *       - in: path
 *         name: DosageOptionId
 *         required: true
 *         description: ID of the dosage option to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully deleted dosage option
 *       '404':
 *         description: Dosage option not found
 *       '500':
 *         description: Server error
 */

router.post("/add", dosageOptionController.addDosageOption);
router.get("/search", dosageOptionController.searchDosageOptions);
router.get("/:DosageOptionId", dosageOptionController.getDosageOptionById);
router.get("/", dosageOptionController.getAllDosageOptions);
router.put("/:DosageOptionId", dosageOptionController.editDosageOption);
router.delete("/:DosageOptionId", dosageOptionController.deleteDosageOption);

module.exports = router;
