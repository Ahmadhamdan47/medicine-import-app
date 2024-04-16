const express = require("express");
const router = express.Router();

const dispensingCategoryController = require("../controllers/dispensingCategoryController");

router.post("/", dispensingCategoryController.addDispensingCategory);
router.get("/:DispensingCategoryId", dispensingCategoryController.getDispensingCategoryById);
router.get("/", dispensingCategoryController.getAllDispensingCategories);
router.put("/:DispensingCategoryId", dispensingCategoryController.editDispensingCategory);
router.delete("/:DispensingCategoryId", dispensingCategoryController.deleteDispensingCategory);

module.exports = router;