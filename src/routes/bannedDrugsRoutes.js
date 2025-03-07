const express = require("express");
const router = express.Router();
const BannedDrugsController = require("../controllers/bannedDrugsController");

router.post("/add", BannedDrugsController.add);
router.get("/all", BannedDrugsController.getAll);
router.delete("/:cisId", BannedDrugsController.remove);

module.exports = router;