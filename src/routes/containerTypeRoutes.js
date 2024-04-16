const express = require("express");
const router = express.Router();

const containerTypeController = require("../controllers/containerTypeController");

router.post("/", containerTypeController.addContainerType);
router.get("/:ContainerTypeId", containerTypeController.getContainerTypeById);
router.get("/", containerTypeController.getAllContainerTypes);
router.put("/:ContainerTypeId", containerTypeController.editContainerType);
router.delete("/:ContainerTypeId", containerTypeController.deleteContainerType);

module.exports = router;