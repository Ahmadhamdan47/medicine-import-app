const express = require("express");
const router = express.Router();

const agentStockController = require("../controllers/agentStockController");

/**
 * @swagger
 * /agentStock/{id}/stock:
 *   put:
 *     summary: Update agent stock
 *     description: Update the stock of an agent by agent ID.
 *     tags: [Importation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the agent whose stock needs to be updated.
 *         schema:
 *           type: string
 *       - in: body
 *         name: stock
 *         required: true
 *         description: The new stock value for the agent.
 *         schema:
 *           type: object
 *           properties:
 *             stock:
 *               type: integer
 *     responses:
 *       '200':
 *         description: OK. Agent stock updated successfully.
 *       '404':
 *         description: Not Found. Agent not found for the specified ID.
 *       '500':
 *         description: Internal Server Error. Failed to update agent stock.
 */
router.put("/:id/stock", agentStockController.stockAgent);

module.exports = router;
