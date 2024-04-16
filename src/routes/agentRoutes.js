const express = require("express");
const router = express.Router();

const agentController = require("../controllers/agentController");

// existing routes...

router.post("/", agentController.addAgent);
router.put("/:agentId", agentController.editAgent);
router.delete("/:agentId", agentController.deleteAgent);

module.exports = router;