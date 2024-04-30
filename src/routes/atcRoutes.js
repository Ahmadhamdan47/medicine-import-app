// const express = require("express");
// const router = express.Router();
// const ATCController = require("../controllers/atcController");

// /**
//  * @swagger
//  * /atc:
//  *   post:
//  *     summary: Add ATC code
//  *     description: Add a new Anatomical Therapeutic Chemical (ATC) code.
//  *     tags: [ATC]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               code:
//  *                 type: string
//  *                 description: The ATC code to add.
//  *             example:
//  *               code: A01AB03
//  *     responses:
//  *       '201':
//  *         description: Created. ATC code added successfully.
//  *       '400':
//  *         description: Bad Request. Invalid input data.
//  *       '500':
//  *         description: Internal Server Error. Failed to add ATC code.
//  */

// /**
//  * @swagger
//  * /atc/{atcId}:
//  *   put:
//  *     summary: Edit ATC code
//  *     description: Update an existing Anatomical Therapeutic Chemical (ATC) code.
//  *     tags: [ATC]
//  *     parameters:
//  *       - in: path
//  *         name: atcId
//  *         required: true
//  *         description: The ID of the ATC code to edit.
//  *         schema:
//  *           type: integer
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               code:
//  *                 type: string
//  *                 description: The updated ATC code.
//  *             example:
//  *               code: A01AB03
//  *     responses:
//  *       '200':
//  *         description: OK. ATC code updated successfully.
//  *       '400':
//  *         description: Bad Request. Invalid input data.
//  *       '404':
//  *         description: Not Found. ATC code with the specified ID not found.
//  *       '500':
//  *         description: Internal Server Error. Failed to update ATC code.
//  *
//  *   delete:
//  *     summary: Delete ATC code
//  *     description: Delete an existing Anatomical Therapeutic Chemical (ATC) code.
//  *     tags: [ATC]
//  *     parameters:
//  *       - in: path
//  *         name: atcId
//  *         required: true
//  *         description: The ID of the ATC code to delete.
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       '204':
//  *         description: No Content. ATC code deleted successfully.
//  *       '404':
//  *         description: Not Found. ATC code with the specified ID not found.
//  *       '500':
//  *         description: Internal Server Error. Failed to delete ATC code.
//  */
// /**
//  * @swagger
//  * /atc/all:
//  *   get:
//  *     summary: Get all ATC codes
//  *     description: Retrieve all Anatomical Therapeutic Chemical (ATC) codes.
//  *     tags: [ATC]
//  *     responses:
//  *       '200':
//  *         description: OK. All ATC codes retrieved successfully.
//  *       '500':
//  *         description: Internal Server Error. Failed to retrieve ATC codes.
//  */

// router.get("/atc/:drugID", ATCController.getATCByDrugID);
// router.get("/all", ATCController.getAllATC);
// router.post("/add", ATCController.addATC);
// router.put("/:atcId", ATCController.editATC);
// router.delete("/:atcId", ATCController.deleteATC);

// module.exports = router;

const express = require("express");
const router = express.Router();
const ATCController = require("../controllers/atcController");

/**
 * @swagger
 * /atc/add:
 *   post:
 *     summary: Add ATC code
 *     description: Add a new Anatomical Therapeutic Chemical (ATC) code.
 *     tags: [ATC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Code:
 *                 type: string
 *                 description: The ATC code to add.
 *               Name:
 *                 type: string
 *                 description: The name of the ATC code.
 *               Description:
 *                 type: string
 *                 description: Description of the ATC code (optional).
 *               ParentID:
 *                 type: integer
 *                 description: The ID of the parent ATC code (optional).
 *             example:
 *               Code: A01AB03
 *               Name: Example ATC
 *               Description: Example description
 *               ParentID: 1
 *     responses:
 *       '201':
 *         description: Created. ATC code added successfully.
 *       '400':
 *         description: Bad Request. Invalid input data.
 *       '500':
 *         description: Internal Server Error. Failed to add ATC code.
 */

/**
 * @swagger
 * /atc/{atcId}:
 *   put:
 *     summary: Edit ATC code
 *     description: Update an existing Anatomical Therapeutic Chemical (ATC) code.
 *     tags: [ATC]
 *     parameters:
 *       - in: path
 *         name: atcId
 *         required: true
 *         description: The ID of the ATC code to edit.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Code:
 *                 type: string
 *                 description: The updated ATC code.
 *               Name:
 *                 type: string
 *                 description: The updated name of the ATC code.
 *               Description:
 *                 type: string
 *                 description: Updated description of the ATC code (optional).
 *               ParentID:
 *                 type: integer
 *                 description: The updated ID of the parent ATC code (optional).
 *             example:
 *               Code: A01AB03
 *               Name: Updated ATC
 *               Description: Updated description
 *               ParentID: 456
 *     responses:
 *       '200':
 *         description: OK. ATC code updated successfully.
 *       '400':
 *         description: Bad Request. Invalid input data.
 *       '404':
 *         description: Not Found. ATC code with the specified ID not found.
 *       '500':
 *         description: Internal Server Error. Failed to update ATC code.
 *
 *   delete:
 *     summary: Delete ATC code
 *     description: Delete an existing Anatomical Therapeutic Chemical (ATC) code.
 *     tags: [ATC]
 *     parameters:
 *       - in: path
 *         name: atcId
 *         required: true
 *         description: The ID of the ATC code to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: No Content. ATC code deleted successfully.
 *       '404':
 *         description: Not Found. ATC code with the specified ID not found.
 *       '500':
 *         description: Internal Server Error. Failed to delete ATC code.
 */
/**
 * @swagger
 * /atc/all:
 *   get:
 *     summary: Get all ATC codes
 *     description: Retrieve all Anatomical Therapeutic Chemical (ATC) codes.
 *     tags: [ATC]
 *     responses:
 *       '200':
 *         description: OK. All ATC codes retrieved successfully.
 *       '500':
 *         description: Internal Server Error. Failed to retrieve ATC codes.
 */

router.get("/atc/:drugID", ATCController.getATCByDrugID);
router.get("/all", ATCController.getAllATC);
router.post("/add", ATCController.addATC);
router.put("/:atcId", ATCController.editATC);
router.delete("/:atcId", ATCController.deleteATC);

module.exports = router;
