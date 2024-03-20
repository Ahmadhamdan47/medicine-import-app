const express = require("express");
const router = express.Router();
const piController = require("../controllers/piController");

/**
 * @swagger
 * /pi/submit/{id}:
 *   put:
 *     summary: Submit PI
 *     description: Submit PI by its ID.
 *     tags: [Importation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the PI to submit.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK. PI submitted successfully.
 *       '404':
 *         description: Not Found. PI not found for the specified ID.
 *       '500':
 *         description: Internal Server Error. Failed to submit PI.
 */
router.put("/submit/:id", piController.submitPI);

module.exports = router;
