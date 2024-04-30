const express = require("express");
const router = express.Router();

const containerTypeController = require("../controllers/containerTypeController");

/**
 * @swagger
 * /containerType/add:
 *   post:
 *     summary: Add a new container type
 *     tags: [Container Type]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TypeName:
 *                 type: string
 *               TypeNameAr:
 *                 type: string
 *               CreatedBy:
 *                 type: integer
 *             example:
 *               TypeName: "Plastic"
 *               TypeNameAr: "بلاستيك"
 *               CreatedBy: 1
 *     responses:
 *       '200':
 *         description: Successfully added container type
 *       '400':
 *         description: Invalid request
 *       '500':
 *         description: Server error
 *
 * /containerType:
 *   get:
 *     summary: Get all container types
 *     tags: [Container Type]
 *     responses:
 *       '200':
 *         description: Successfully retrieved all container types
 *       '500':
 *         description: Server error
 *
 * /containerType/{ContainerTypeId}:
 *   get:
 *     summary: Get a container type by ID
 *     tags: [Container Type]
 *     parameters:
 *       - in: path
 *         name: ContainerTypeId
 *         required: true
 *         description: ID of the container type to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully retrieved container type
 *       '404':
 *         description: Container type not found
 *       '500':
 *         description: Server error
 *   put:
 *     summary: Update a container type
 *     tags: [Container Type]
 *     parameters:
 *       - in: path
 *         name: ContainerTypeId
 *         required: true
 *         description: ID of the container type to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TypeName:
 *                 type: string
 *               TypeNameAr:
 *                 type: string
 *               UpdatedBy:
 *                 type: integer
 *             example:
 *               TypeName: "Plastic"
 *               TypeNameAr: "بلاستيك"
 *               UpdatedBy: 1
 *     responses:
 *       '200':
 *         description: Successfully updated container type
 *       '400':
 *         description: Invalid request
 *       '404':
 *         description: Container type not found
 *       '500':
 *         description: Server error
 *   delete:
 *     summary: Delete a container type
 *     tags: [Container Type]
 *     parameters:
 *       - in: path
 *         name: ContainerTypeId
 *         required: true
 *         description: ID of the container type to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully deleted container type
 *       '404':
 *         description: Container type not found
 *       '500':
 *         description: Server error
 */

router.post("/add", containerTypeController.addContainerType);
router.get("/:ContainerTypeId", containerTypeController.getContainerTypeById);
router.get("/", containerTypeController.getAllContainerTypes);
router.put("/:ContainerTypeId", containerTypeController.editContainerType);
router.delete("/:ContainerTypeId", containerTypeController.deleteContainerType);

module.exports = router;
