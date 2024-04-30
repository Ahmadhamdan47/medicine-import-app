const express = require("express");
const router = express.Router();

const agentController = require("../controllers/agentController");

/**
 * @swagger
 * /agent/add:
 *   post:
 *     summary: Add Agent
 *     description: Add a new agent.
 *     tags: [Agent]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               AgentName:
 *                 type: string
 *                 description: The name of the agent.
 *                 example: John Doe
 *               AgentType:
 *                 type: string
 *                 description: The type of the agent.
 *                 example: Supplier
 *               ContactName:
 *                 type: string
 *                 description: The contact name of the agent.
 *                 example: Jane Smith
 *               ContactEmail:
 *                 type: string
 *                 description: The contact email of the agent.
 *                 example: jane@example.com
 *               ContactPhone:
 *                 type: string
 *                 description: The contact phone number of the agent.
 *                 example: +1234567890
 *               Address:
 *                 type: string
 *                 description: The address of the agent.
 *                 example: 123 Main St
 *               City:
 *                 type: string
 *                 description: The city of the agent's address.
 *                 example: Anytown
 *               Country:
 *                 type: string
 *                 description: The country of the agent's address.
 *                 example: USA
 *               PostalCode:
 *                 type: string
 *                 description: The postal code of the agent's address.
 *                 example: 12345
 *               IsSupplier:
 *                 type: boolean
 *                 description: Whether the agent is a supplier.
 *                 example: true
 *               IsManufacturer:
 *                 type: boolean
 *                 description: Whether the agent is a manufacturer.
 *                 example: false
 *               IsActive:
 *                 type: boolean
 *                 description: Whether the agent is active.
 *                 example: true
 *     responses:
 *       '201':
 *         description: Created. Agent added successfully.
 *       '400':
 *         description: Bad Request. Invalid input data.
 *       '500':
 *         description: Internal Server Error. Failed to add agent.
 */

/**
 * @swagger
 * /agent/{agentId}:
  *   put:
 *     summary: Edit Agent
 *     description: Update an existing agent.
 *     tags: [Agent]
 *     parameters:
 *       - in: path
 *         name: agentId
 *         required: true
 *         description: The ID of the agent to edit.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               AgentName:
 *                 type: string
 *                 description: The updated name of the agent.
 *                 example: Updated Agent Name
 *               AgentType:
 *                 type: string
 *                 description: The updated type of the agent.
 *                 example: Distributor
 *               ContactName:
 *                 type: string
 *                 description: The updated contact name of the agent.
 *                 example: John Smith
 *               ContactEmail:
 *                 type: string
 *                 description: The updated contact email of the agent.
 *                 example: john@example.com
 *               ContactPhone:
 *                 type: string
 *                 description: The updated contact phone number of the agent.
 *                 example: +1987654321
 *               Address:
 *                 type: string
 *                 description: The updated address of the agent.
 *                 example: 456 Park Ave
 *               City:
 *                 type: string
 *                 description: The updated city of the agent's address.
 *                 example: Othertown
 *               Country:
 *                 type: string
 *                 description: The updated country of the agent's address.
 *                 example: Canada
 *               PostalCode:
 *                 type: string
 *                 description: The updated postal code of the agent's address.
 *                 example: 54321
 *               IsSupplier:
 *                 type: boolean
 *                 description: Whether the agent is still a supplier.
 *                 example: false
 *               IsManufacturer:
 *                 type: boolean
 *                 description: Whether the agent is still a manufacturer.
 *                 example: true
 *               IsActive:
 *                 type: boolean
 *                 description: Whether the agent is still active.
 *                 example: true
 *     responses:
 *       '200':
 *         description: OK. Agent updated successfully.
 *       '400':
 *         description: Bad Request. Invalid input data.
 *       '404':
 *         description: Not Found. Agent with the specified ID not found.
 *       '500':
 *         description: Internal Server Error. Failed to update agent.
 *
 *   delete:
 *     summary: Delete Agent
 *     description: Delete an existing agent.
 *     tags: [Agent]
 *     parameters:
 *       - in: path
 *         name: agentId
 *         required: true
 *         description: The ID of the agent to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: No Content. Agent deleted successfully.
 *       '404':
 *         description: Not Found. Agent with the specified ID not found.
 *       '500':
 *         description: Internal Server Error. Failed to delete agent.
 */

/**
 * @swagger
 * /agent/all:
 *   get:
 *     summary: Get all Agents
 *     description: Retrieve all agents.
 *     tags: [Agent]
 *     responses:
 *       '200':
 *         description: OK. All agents retrieved successfully.
 *       '500':
 *         description: Internal Server Error. Failed to retrieve agents.
 */

router.post("/add", agentController.addAgent);
router.put("/:agentId", agentController.editAgent);
router.delete("/:agentId", agentController.deleteAgent);
router.get("/all", agentController.getAllAgents);

module.exports = router;
