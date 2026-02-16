const express = require("express");
const router = express.Router();

const routeOptionController = require("../controllers/routeOptionController");

/**
 * @swagger
 * /routeOptions/add:
 *   post:
 *     summary: Add a new route option
 *     tags: [Route Options]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Acronym:
 *                 type: string
 *               Route:
 *                 type: string
 *               Category:
 *                 type: string
 *               SoloMultiple:
 *                 type: string
 *               MultipleOption:
 *                 type: string
 *               CreatedBy:
 *                 type: integer
 *             example:
 *               Acronym: "IV"
 *               Route: "Intravenous"
 *               Category: "Parenteral"
 *               SoloMultiple: "Multiple"
 *               MultipleOption: "with other parenteral"
 *               CreatedBy: 1
 *     responses:
 *       '200':
 *         description: Successfully added route option
 *       '400':
 *         description: Invalid request
 *       '500':
 *         description: Server error
 *
 * /routeOptions:
 *   get:
 *     summary: Get all route options
 *     tags: [Route Options]
 *     responses:
 *       '200':
 *         description: Successfully retrieved all route options
 *       '500':
 *         description: Server error
 *
 * /routeOptions/search:
 *   get:
 *     summary: Search route options
 *     tags: [Route Options]
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         description: Search term for acronym, route, or category
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved matching route options
 *       '400':
 *         description: Search term is required
 *       '500':
 *         description: Server error
 *
 * /routeOptions/{RouteOptionId}:
 *   get:
 *     summary: Get a route option by ID
 *     tags: [Route Options]
 *     parameters:
 *       - in: path
 *         name: RouteOptionId
 *         required: true
 *         description: ID of the route option to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully retrieved route option
 *       '404':
 *         description: Route option not found
 *       '500':
 *         description: Server error
 *   put:
 *     summary: Update a route option
 *     tags: [Route Options]
 *     parameters:
 *       - in: path
 *         name: RouteOptionId
 *         required: true
 *         description: ID of the route option to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Acronym:
 *                 type: string
 *               Route:
 *                 type: string
 *               Category:
 *                 type: string
 *               SoloMultiple:
 *                 type: string
 *               MultipleOption:
 *                 type: string
 *               UpdatedBy:
 *                 type: integer
 *             example:
 *               Route: "Intravenous (updated)"
 *               UpdatedBy: 1
 *     responses:
 *       '200':
 *         description: Successfully updated route option
 *       '400':
 *         description: Invalid request
 *       '404':
 *         description: Route option not found
 *       '500':
 *         description: Server error
 *   delete:
 *     summary: Delete a route option
 *     tags: [Route Options]
 *     parameters:
 *       - in: path
 *         name: RouteOptionId
 *         required: true
 *         description: ID of the route option to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully deleted route option
 *       '404':
 *         description: Route option not found
 *       '500':
 *         description: Server error
 */

router.post("/add", routeOptionController.addRouteOption);
router.get("/search", routeOptionController.searchRouteOptions);
router.get("/:RouteOptionId", routeOptionController.getRouteOptionById);
router.get("/", routeOptionController.getAllRouteOptions);
router.put("/:RouteOptionId", routeOptionController.editRouteOption);
router.delete("/:RouteOptionId", routeOptionController.deleteRouteOption);

module.exports = router;
