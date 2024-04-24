const express = require('express');
const router = express.Router();
const swiftController = require('../controllers/swiftController');

/**
 * @swagger
 * /swift/submit/{id}:
 *   put:
 *     summary: Submit Swift
 *     description: Submit a Swift by its ID.
  *     tags: [Importation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the Swift to submit.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK. Swift submitted successfully.
 *       '404':
 *         description: Not Found. Swift not found for the specified ID.
 *       '500':
 *         description: Internal Server Error. Failed to submit Swift.
 */
router.put('/submit/:id', swiftController.submitSwift);

module.exports = router;
